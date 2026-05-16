import { Request, Response } from "express";
import { Lead } from "../models/Lead.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Types } from "mongoose";
import { UserRole } from "../models/User.model";

export const getLeads = async (req: Request, res: Response) => {
  const userId = req.user?.id as string | Types.ObjectId | undefined;
  if (!userId) throw new ApiError("Unauthorized", 401);

  const { page = "1", limit = "10", status, source, search, sort = "latest" } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  // RBAC: Admin sees ALL leads; Sales sees only their own
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const query: Record<string, unknown> = {};

  if (!isAdmin) {
    query.createdBy = new Types.ObjectId(userId as string);
  }

  // Advanced filtering
  if (status) query.status = status;
  if (source) query.source = source;

  // Search
  if (search) {
    const searchRegex = new RegExp(search as string, "i");
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  // Sorting
  const sortOption: Record<string, 1 | -1> = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const [leads, total] = await Promise.all([
    Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate("createdBy", "name email"),
    Lead.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.json(new ApiResponse({
    leads,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,
      from: skip + 1,
      to: Math.min(skip + limitNum, total)
    }
  }, "Leads fetched", true, 200));
};

export const getLeadById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const lead = await Lead.findById(id).populate("createdBy", "name email");
  if (!lead) throw new ApiError("Lead not found", 404);
  res.json(new ApiResponse(lead, "Lead fetched", true, 200));
};

export const createLead = async (req: Request, res: Response) => {
  const userId = req.user?.id as string | Types.ObjectId | undefined;
  if (!userId) throw new ApiError("Unauthorized", 401);
  const { name, email, status, source } = req.body;
  const lead = await Lead.create({ name, email, status, source, createdBy: userId });
  res.status(201).json(new ApiResponse(lead, "Lead created", true, 201));
};

export const updateLead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const isAdmin = req.user?.role === UserRole.ADMIN;

  // Sales users can only update their own leads
  const lead = await Lead.findById(id);
  if (!lead) throw new ApiError("Lead not found", 404);
  if (!isAdmin && String(lead.createdBy) !== String(userId)) {
    throw new ApiError("Forbidden: you can only edit your own leads", 403);
  }

  const updated = await Lead.findByIdAndUpdate(id, req.body, { new: true }).populate("createdBy", "name email");
  res.json(new ApiResponse(updated, "Lead updated", true, 200));
};

export const deleteLead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const isAdmin = req.user?.role === UserRole.ADMIN;

  const lead = await Lead.findById(id);
  if (!lead) throw new ApiError("Lead not found", 404);
  // Allow deletion (RBAC check disabled as per user request to allow deleting any lead)
  await Lead.findByIdAndDelete(id);
  res.json(new ApiResponse(null, "Lead deleted", true, 200));
};

export const exportLeads = async (req: Request, res: Response) => {
  const userId = req.user?.id as string | Types.ObjectId | undefined;
  if (!userId) throw new ApiError("Unauthorized", 401);

  const { status, source, search, sort = "latest" } = req.query;
  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (source) query.source = source;
  if (search) {
    const searchRegex = new RegExp(search as string, "i");
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const sortOption: Record<string, 1 | -1> = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const leads = await Lead.find(query).sort(sortOption).populate("createdBy", "name email");

  const headers = ["Name", "Email", "Status", "Source", "Created At", "Owner"];

  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    let s = String(v);
    s = s.replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = leads.map((l) => {
    const ownerDoc = l.createdBy as unknown as { name: string; email: string } | null;
    const owner = ownerDoc ? `${ownerDoc.name || ""} <${ownerDoc.email || ""}>` : "";
    const createdAt = (l as any).createdAt ? new Date((l as any).createdAt).toISOString() : "";
    return [l.name, l.email || "", l.status, l.source, createdAt, owner]
      .map(escape)
      .join(",");
  });

  const csv = `${headers.join(",")}\n${rows.join("\n")}`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename=leads_${Date.now()}.csv`);
  res.send(csv);
};

export const getStats = async (req: Request, res: Response) => {
  const userId = req.user?.id as string | Types.ObjectId | undefined;
  if (!userId) throw new ApiError("Unauthorized", 401);

  // RBAC: Admin sees all stats; Sales sees only their own
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const baseMatch: Record<string, unknown> = isAdmin ? {} : { createdBy: new Types.ObjectId(userId as string) };

  // ── Time windows ───────────────────────────────────────────
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // ── All-time totals by status ───────────────────────────────
  const agg = await Lead.aggregate([
    { $match: baseMatch },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const counts = agg.reduce<Record<string, number>>((acc, cur) => {
    acc[cur._id] = cur.count;
    return acc;
  }, {});

  const total = Object.values(counts).reduce((s, c) => s + c, 0);

  // ── New this month ──────────────────────────────────────────
  const newThisMonth = await Lead.countDocuments({
    ...baseMatch,
    createdAt: { $gte: startOfMonth },
  });

  // ── New this week ───────────────────────────────────────────
  const newThisWeek = await Lead.countDocuments({
    ...baseMatch,
    createdAt: { $gte: startOfWeek },
  });

  // ── Total leads created last month (for delta) ──────────────
  const totalLastMonth = await Lead.countDocuments({
    ...baseMatch,
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
  });

  // Delta: leads added THIS month vs leads added LAST month
  const vsLastMonth = newThisMonth - totalLastMonth;

  // ── Conversion rate ─────────────────────────────────────────
  const qualified = counts["Qualified"] ?? 0;
  const conversionRate = total > 0 ? Math.round((qualified / total) * 100) : 0;

  res.json(
    new ApiResponse(
      {
        total,
        counts,
        newThisMonth,
        newThisWeek,
        vsLastMonth,
        conversionRate,
      },
      "Stats fetched",
      true,
      200
    )
  );
};

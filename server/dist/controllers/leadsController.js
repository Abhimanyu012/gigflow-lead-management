"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLead = exports.updateLead = exports.createLead = exports.getLeadById = exports.getLeads = void 0;
const Lead_model_1 = require("../models/Lead.model");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const getLeads = async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new ApiError_1.ApiError("Unauthorized", 401);
    const { page = "1", limit = "10", status, source, search, sort = "latest" } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const query = {};
    // Advanced filtering
    if (status)
        query.status = status;
    if (source)
        query.source = source;
    // Search
    if (search) {
        const searchRegex = new RegExp(search, "i");
        query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }
    // Sorting
    const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };
    const [leads, total] = await Promise.all([
        Lead_model_1.Lead.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .populate("createdBy", "name email"),
        Lead_model_1.Lead.countDocuments(query),
    ]);
    const totalPages = Math.ceil(total / limitNum);
    res.json(new ApiResponse_1.ApiResponse({
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
exports.getLeads = getLeads;
const getLeadById = async (req, res) => {
    const { id } = req.params;
    const lead = await Lead_model_1.Lead.findById(id).populate("createdBy", "name email");
    if (!lead)
        throw new ApiError_1.ApiError("Lead not found", 404);
    res.json(new ApiResponse_1.ApiResponse(lead, "Lead fetched", true, 200));
};
exports.getLeadById = getLeadById;
const createLead = async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        throw new ApiError_1.ApiError("Unauthorized", 401);
    const { name, email, status, source, notes } = req.body;
    const lead = await Lead_model_1.Lead.create({ name, email, status, source, notes, createdBy: userId });
    res.status(201).json(new ApiResponse_1.ApiResponse(lead, "Lead created", true, 201));
};
exports.createLead = createLead;
const updateLead = async (req, res) => {
    const { id } = req.params;
    const lead = await Lead_model_1.Lead.findByIdAndUpdate(id, req.body, { new: true });
    if (!lead)
        throw new ApiError_1.ApiError("Lead not found", 404);
    res.json(new ApiResponse_1.ApiResponse(lead, "Lead updated", true, 200));
};
exports.updateLead = updateLead;
const deleteLead = async (req, res) => {
    const { id } = req.params;
    const lead = await Lead_model_1.Lead.findByIdAndDelete(id);
    if (!lead)
        throw new ApiError_1.ApiError("Lead not found", 404);
    res.json(new ApiResponse_1.ApiResponse(null, "Lead deleted", true, 200));
};
exports.deleteLead = deleteLead;

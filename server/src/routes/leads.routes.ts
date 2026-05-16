import { Router } from "express";
import { getLeads, createLead, updateLead, deleteLead, getLeadById, exportLeads, getStats } from "../controllers/leadsController";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "../models/User.model";
import { z } from "zod";
import { validate } from "../middleware/validateMiddleware";

const router = Router();

const createLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  status: z.enum(["New", "Contacted", "Qualified", "Lost"]).optional(),
  source: z.enum(["Website", "Instagram", "Referral"]).optional(),
});

const updateLeadSchema = createLeadSchema.partial();

router.use(authMiddleware);

router.get("/export", authorizeRoles([UserRole.ADMIN]), asyncHandler(exportLeads));
router.get("/stats", asyncHandler(getStats));
router.get("/", asyncHandler(getLeads));
router.get("/:id", asyncHandler(getLeadById));
router.post("/", validate(createLeadSchema), asyncHandler(createLead));
router.put("/:id", validate(updateLeadSchema), asyncHandler(updateLead));
router.delete("/:id", authorizeRoles([UserRole.ADMIN, UserRole.SALES]), asyncHandler(deleteLead));

export default router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leadsController_1 = require("../controllers/leadsController");
const asyncHandler_1 = require("../utils/asyncHandler");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const zod_1 = require("zod");
const validateMiddleware_1 = require("../middleware/validateMiddleware");
const router = (0, express_1.Router)();
const createLeadSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email().optional(),
    status: zod_1.z.enum(["New", "Contacted", "Qualified", "Lost"]).optional(),
    source: zod_1.z.enum(["Website", "Instagram", "Referral"]).optional(),
    notes: zod_1.z.string().optional(),
});
const updateLeadSchema = createLeadSchema.partial();
router.use(authMiddleware_1.authMiddleware);
router.get("/", (0, asyncHandler_1.asyncHandler)(leadsController_1.getLeads));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(leadsController_1.getLeadById));
router.post("/", (0, validateMiddleware_1.validate)(createLeadSchema), (0, asyncHandler_1.asyncHandler)(leadsController_1.createLead));
router.put("/:id", (0, validateMiddleware_1.validate)(updateLeadSchema), (0, asyncHandler_1.asyncHandler)(leadsController_1.updateLead));
router.delete("/:id", (0, roleMiddleware_1.requireRole)(["admin"]), (0, asyncHandler_1.asyncHandler)(leadsController_1.deleteLead));
exports.default = router;

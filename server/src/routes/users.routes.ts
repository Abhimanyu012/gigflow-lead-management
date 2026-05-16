import { Router } from "express";
import { listUsers, updateUserRole } from "../controllers/userController";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "../models/User.model";

const router = Router();

router.use(authMiddleware);

// admin-only: list and manage users
router.get("/", authorizeRoles([UserRole.ADMIN]), asyncHandler(listUsers));
router.put("/:id/role", authorizeRoles([UserRole.ADMIN]), asyncHandler(updateUserRole));

export default router;

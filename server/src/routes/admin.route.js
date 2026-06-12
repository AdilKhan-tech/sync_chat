import express from "express";
import { getStats, getAllUsers, deleteUser, getReports } from "../controllers/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();
router.use(protectRoute, requireAdmin);

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/reports", getReports);

export default router;

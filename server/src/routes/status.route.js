import express from "express";

import {
  createStatus,
  getMyStatus,
  getStatusFeed,
  viewStatus,
  replyStatus,
  deleteStatus,
  getStatusViews,
} from "../controllers/status.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// Apply Middleware
router.use(arcjetProtection, protectRoute);

// Feed
router.get("/feed", getStatusFeed);

// My Status
router.get("/me", getMyStatus);

// Status Views
router.get("/:statusId/views", getStatusViews);

// Create Status
router.post("/", createStatus);

// View Status
router.post("/:statusId/view", viewStatus);

// Reply Status
router.post("/:statusId/reply", replyStatus);

// Delete Status
router.delete("/:statusId", deleteStatus);

export default router;

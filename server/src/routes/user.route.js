import express from "express";
import {
  updateStatus,
  updateSettings,
  getChatPrefs,
  getBlockedUsers,
  getBlockStatusForUser,
  blockUser,
  unblockUser,
  reportUser,
  pinChat,
  unpinChat,
  archiveChat,
  unarchiveChat,
  muteChat,
  unmuteChat,
  getSessions,
  revokeSession,
  getUserProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protectRoute);

router.get("/profile/:id", getUserProfile);
router.get("/chat-prefs", getChatPrefs);
router.get("/blocked", getBlockedUsers);
router.get("/block-status/:id", getBlockStatusForUser);
router.put("/status", updateStatus);
router.put("/settings", updateSettings);
router.post("/block/:id", blockUser);
router.delete("/block/:id", unblockUser);
router.post("/report", reportUser);
router.post("/pin", pinChat);
router.post("/unpin", unpinChat);
router.post("/archive", archiveChat);
router.post("/unarchive", unarchiveChat);
router.post("/mute", muteChat);
router.post("/unmute", unmuteChat);
router.get("/sessions", getSessions);
router.delete("/sessions/:sessionId", revokeSession);

export default router;

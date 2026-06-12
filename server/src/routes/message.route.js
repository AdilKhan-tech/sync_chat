import express from "express";
import {
  getAllContacts,
  getMessagesByUserId,
  sendMessage,
  getChatPartners,
  searchMessages,
  editMessage,
  deleteMessage,
  reactToMessage,
  markMessagesRead,
  markChatSeen,
  exportChat,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection, protectRoute);

router.get("/search", searchMessages);
router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/export/:id", exportChat);
router.post("/send/:id", sendMessage);
router.put("/:messageId", editMessage);
router.delete("/:messageId", deleteMessage);
router.post("/:messageId/react", reactToMessage);
router.post("/seen/:partnerId", markChatSeen);
router.post("/read/:partnerId", markMessagesRead);
router.get("/:id", getMessagesByUserId);

export default router;

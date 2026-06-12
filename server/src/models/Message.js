import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    emoji: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false },
);

const readReceiptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    readAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  messageType: {
    type: String,
    enum: ["text", "image", "file", "voice", "system"],
    default: "text",
  },
  text: { type: String, default: "" },
  image: { type: String },
  fileUrl: { type: String },
  fileName: { type: String },
  fileSize: { type: Number },
  mimeType: { type: String },
  voiceUrl: { type: String },
  voiceDuration: { type: Number },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  reactions: [reactionSchema],
  readBy: [readReceiptSchema],
  deliveredTo: [readReceiptSchema],
  editedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  linkPreview: {
    url: String,
    title: String,
    description: String,
    image: String,
  },
  isEncrypted: { type: Boolean, default: false },
  encryptedPayload: { type: String },
  timestamp: { type: Date, default: Date.now },
});

messageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });
messageSchema.index({ groupId: 1, timestamp: -1 });
messageSchema.index({ text: "text" });

const Message = mongoose.model("Message", messageSchema);
export default Message;

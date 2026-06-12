import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    sessionId: String,
    userAgent: String,
    ip: String,
    lastActive: { type: Date, default: Date.now },
  },
  { _id: true },
);

const chatPrefSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, required: true },
    chatType: { type: String, enum: ["user", "group"], default: "user" },
    mutedUntil: Date,
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.oauthGoogleId;
      },
    },
    profilePic: { type: String, default: "" },
    oauthGoogleId: { type: String, sparse: true },
    isAdmin: { type: Boolean, default: false },
    lastSeenAt: { type: Date, default: Date.now },
    presenceStatus: {
      type: String,
      enum: ["online", "away", "busy", "offline"],
      default: "offline",
    },
    customStatus: { type: String, default: "" },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    mutedChats: [chatPrefSchema],
    pinnedChats: [chatPrefSchema],
    archivedChats: [chatPrefSchema],
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    pushSubscriptions: [
      {
        endpoint: String,
        keys: { p256dh: String, auth: String },
      },
    ],
    sessions: [sessionSchema],
    publicKey: { type: String, default: "" },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;

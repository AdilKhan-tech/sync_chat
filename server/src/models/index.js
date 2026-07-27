import User from "./User.js";
import Message from "./Message.js";
import Report from "./Report.js";
import Otp from "./Otp.js";

import Status from "./Status.js";
import StatusView from "./StatusView.js";
import StatusReply from "./StatusReply.js";

/*
|--------------------------------------------------------------------------
| Message Relations
|--------------------------------------------------------------------------
*/

Message.belongsTo(User, {
  as: "sender",
  foreignKey: "senderId",
});

Message.belongsTo(User, {
  as: "receiver",
  foreignKey: "receiverId",
});

Message.belongsTo(Message, {
  as: "replyToMessage",
  foreignKey: "replyTo",
});

/*
|--------------------------------------------------------------------------
| Report Relations
|--------------------------------------------------------------------------
*/

Report.belongsTo(User, {
  as: "reporter",
  foreignKey: "reporterId",
});

Report.belongsTo(User, {
  as: "reportedUser",
  foreignKey: "reportedUserId",
});

Report.belongsTo(Message, {
  as: "message",
  foreignKey: "messageId",
});

/*
|--------------------------------------------------------------------------
| Status Relations
|--------------------------------------------------------------------------
*/

// User -> Status

User.hasMany(Status, {
  as: "statuses",
  foreignKey: "userId",
});

Status.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});

// Status -> Views

Status.hasMany(StatusView, {
  as: "views",
  foreignKey: "statusId",
  onDelete: "CASCADE",
});

StatusView.belongsTo(Status, {
  as: "status",
  foreignKey: "statusId",
});

// User -> Status Views

User.hasMany(StatusView, {
  as: "statusViews",
  foreignKey: "viewerId",
});

StatusView.belongsTo(User, {
  as: "viewer",
  foreignKey: "viewerId",
});

// Status -> Replies

Status.hasMany(StatusReply, {
  as: "replies",
  foreignKey: "statusId",
  onDelete: "CASCADE",
});

StatusReply.belongsTo(Status, {
  as: "status",
  foreignKey: "statusId",
});

// Sender

User.hasMany(StatusReply, {
  as: "sentStatusReplies",
  foreignKey: "senderId",
});

StatusReply.belongsTo(User, {
  as: "sender",
  foreignKey: "senderId",
});

// Receiver

User.hasMany(StatusReply, {
  as: "receivedStatusReplies",
  foreignKey: "receiverId",
});

StatusReply.belongsTo(User, {
  as: "receiver",
  foreignKey: "receiverId",
});

export { User, Message, Report, Status, StatusView, StatusReply, Otp };

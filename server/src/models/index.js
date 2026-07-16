import User from "./User.js";
import Message from "./Message.js";
import Report from "./Report.js";

Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Message.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });
Message.belongsTo(Message, { as: "replyToMessage", foreignKey: "replyTo" });

Report.belongsTo(User, { as: "reporter", foreignKey: "reporterId" });
Report.belongsTo(User, { as: "reportedUser", foreignKey: "reportedUserId" });
Report.belongsTo(Message, { as: "message", foreignKey: "messageId" });

export { User, Message, Report };

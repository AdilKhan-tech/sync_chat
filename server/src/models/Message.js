import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { addApiId } from "../lib/sequelizeHelpers.js";

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    messageType: {
      type: DataTypes.ENUM("text", "image", "file", "voice", "system"),
      defaultValue: "text",
    },
    text: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    voiceUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    voiceDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    replyTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reactions: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    readBy: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    deliveredTo: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    editedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedFor: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    linkPreview: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isEncrypted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    encryptedPayload: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "messages",
    timestamps: false,
  },
);

addApiId(Message);

export default Message;

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { addApiId } from "../lib/sequelizeHelpers.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePic: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    oauthGoogleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastSeenAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    presenceStatus: {
      type: DataTypes.ENUM("online", "away", "busy", "offline"),
      defaultValue: "offline",
    },
    customStatus: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    theme: {
      type: DataTypes.ENUM("dark", "light"),
      defaultValue: "dark",
    },
    blockedUsers: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    mutedChats: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    pinnedChats: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    archivedChats: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    unreadCounts: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pushSubscriptions: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    sessions: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    publicKey: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

addApiId(User);

export default User;

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { addApiId } from "../lib/sequelizeHelpers.js";

const Status = sequelize.define(
  "Status",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("image", "video", "text"),
      allowNull: false,
      defaultValue: "image",
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    video: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    backgroundColor: {
      type: DataTypes.STRING,
      defaultValue: "#075E54",
    },

    fontColor: {
      type: DataTypes.STRING,
      defaultValue: "#FFFFFF",
    },

    privacy: {
      type: DataTypes.ENUM(
        "everyone",
        "contacts",
        "contacts_except",
        "only_share_with",
      ),
      defaultValue: "contacts",
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "statuses",
    timestamps: true,
  },
);

addApiId(Status);

export default Status;

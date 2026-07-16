import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { addApiId } from "../lib/sequelizeHelpers.js";

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reportedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "reviewed", "resolved"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "reports",
    timestamps: true,
  },
);

addApiId(Report);

export default Report;

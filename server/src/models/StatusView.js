import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { addApiId } from "../lib/sequelizeHelpers.js";

const StatusView = sequelize.define(
  "StatusView",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    viewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "status_views",
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ["statusId", "viewerId"],
      },
    ],
  },
);

addApiId(StatusView);

export default StatusView;

import { Sequelize } from "sequelize";

const sequelize = new Sequelize("sync_chat", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export default sequelize;

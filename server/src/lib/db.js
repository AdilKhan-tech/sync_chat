import sequelize from "../config/database.js";

let connected = false;

export const isDBConnected = () => connected;

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    connected = true;
    console.log("Connection to the database has been established successfully.");
  } catch (error) {
    connected = false;
    console.error("Unable to connect to the database:", error.message);
    throw error;
  }
};

export { sequelize };

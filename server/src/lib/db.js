import mongoose from "mongoose";
import { ENV } from "./env.js";

export const isDBConnected = () => mongoose.connection.readyState === 1;

export const connectDB = async () => {
  const { MONGO_URL } = ENV;
  if (!MONGO_URL) {
    throw new Error("MONGO_URL is not defined in environment variables");
  }

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB runtime error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
  });

  try {
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10,
      minPoolSize: 1,
      retryWrites: true,
      w: "majority",
      heartbeatFrequencyMS: 10000,
    });

    console.log("MongoDB connected successfully", mongoose.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

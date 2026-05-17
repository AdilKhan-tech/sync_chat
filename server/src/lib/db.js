import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { MONGO_URL } = process.env;
    if (!MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    } 
    const connec = await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully", connec.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

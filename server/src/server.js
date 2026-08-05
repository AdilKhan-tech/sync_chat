import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import statusRoutes from "./routes/status.route.js";
import adminRoutes from "./routes/admin.route.js";

import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { initSocket } from "./lib/socket.js";

import "./models/index.js";

const app = express();
const httpServer = createServer(app);

const PORT = ENV.PORT || 5000;

// ======================
// CORS
// ======================
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

// ======================
// Middlewares
// ======================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ======================
// Health Routes
// ======================
app.get("/", (req, res) => {
  res.status(200).send("Backend Running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running",
    port: PORT,
    environment: ENV.NODE_ENV,
  });
});

app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Working",
  });
});

// ======================
// API Routes
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// ======================
// Socket.io
// ======================
initSocket(httpServer);

// ======================
// Start Server
// ======================
const startServer = async () => {
  try {
    console.log("==================================");
    console.log("Starting SyncChat Backend...");
    console.log("PORT:", PORT);
    console.log("NODE_ENV:", ENV.NODE_ENV);
    console.log("CLIENT_URL:", ENV.CLIENT_URL);
    console.log("==================================");

    await connectDB();

    console.log("Database Connected Successfully");

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server Startup Error:");
    console.error(error);
    process.exit(1);
  }
};

startServer();
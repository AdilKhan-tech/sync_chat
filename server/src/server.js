import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { createServer } from "http";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import statusRoutes from "./routes/status.route.js";
import adminRoutes from "./routes/admin.route.js";
import { connectDB } from "./lib/db.js";
import "./models/index.js";
import { ENV } from "./lib/env.js";
import { initSocket } from "./lib/socket.js";
import cors from "cors";

const app = express();
const __dirname = path.resolve();
const httpServer = createServer(app);

const PORT = ENV.PORT || 5000;

// CORS FIRST — before body parsers, so error responses also get CORS headers
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// Increase limits for base64 video/image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

initSocket(httpServer);

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

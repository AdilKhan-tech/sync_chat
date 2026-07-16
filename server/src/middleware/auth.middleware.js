import { ENV } from "../lib/env.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isDBConnected } from "../lib/db.js";
import { plainUser } from "../lib/sequelizeHelpers.js";

export const protectRoute = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ message: "Database unavailable. Please try again." });
    }

    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password", "twoFactorSecret", "resetPasswordToken", "resetPasswordExpires"] },
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = plainUser(user);
    req.userModel = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized - Token verification failed" });
    }

    if (error.name === "SequelizeConnectionError" || error.code === "EPIPE") {
      console.error("Auth DB network error:", error.message);
      return res.status(503).json({ message: "Database connection lost. Please try again." });
    }

    console.error("Auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

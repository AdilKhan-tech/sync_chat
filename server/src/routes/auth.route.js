import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  googleAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { sanitizeUser } from "../lib/userHelpers.js";

const router = express.Router();

router.post("/signup", arcjetProtection, signup);
router.post("/login", arcjetProtection, login);
router.post("/logout", arcjetProtection, logout);
router.post("/google", arcjetProtection, googleAuth);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, (req, res) => {
  res.status(200).json(sanitizeUser(req.user));
});

export default router;

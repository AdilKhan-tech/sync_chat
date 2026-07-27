import { Op } from "sequelize";
import { OAuth2Client } from "google-auth-library";
import cloudinary from "../lib/cloudinary.js";
import { ENV } from "../lib/env.js";
import Otp from "../models/Otp.js";
import transporter from "../lib/mailer.js";
import { generateToken } from "../lib/utils.js";
import { sanitizeUser } from "../lib/userHelpers.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const googleClient = ENV.GOOGLE_CLIENT_ID
  ? new OAuth2Client(ENV.GOOGLE_CLIENT_ID)
  : null;

const formatAuthUser = (user) => sanitizeUser(user);

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (await User.findOne({ where: { email } })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const savedUser = await User.create({ fullName, email, password: hashedPassword });
    generateToken(savedUser.id, res);
    return res.status(201).json(formatAuthUser(savedUser));
  } catch (error) {
    console.log("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.password && user.oauthGoogleId) {
      return res.status(400).json({ message: "Use Google sign-in for this account" });
    }
    if (!user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user.id, res);
    return res.json(formatAuthUser(user));
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await Otp.destroy({
      where: { email },
    });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log("OTP:", otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Sync Chat Login OTP",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Sync Chat</h2>

          <p>Your verification code is</p>

          <h1 style="letter-spacing:5px">
            ${otp}
          </h1>

          <p>
            This code will expire in
            5 minutes.
          </p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const otpRecord = await Otp.findOne({
      where: { email },
      order: [["createdAt", "DESC"]],
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      await otpRecord.destroy();

      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Login user
    generateToken(user.id, res);

    // Delete OTP after successful login
    await otpRecord.destroy();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: formatAuthUser(user),
    });

  } catch (error) {
    console.log("Verify OTP Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, customStatus } = req.body;
    const update = {};
    if (fullName) update.fullName = fullName;
    if (customStatus !== undefined) update.customStatus = customStatus;
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      update.profilePic = uploadResponse.secure_url;
    }
    if (!Object.keys(update).length) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    await User.update(update, { where: { id: req.user._id } });
    const updatedUser = await User.findByPk(req.user._id, {
      attributes: { exclude: ["password", "twoFactorSecret", "resetPasswordToken", "resetPasswordExpires"] },
    });
    res.status(200).json(formatAuthUser(updatedUser));
  } catch (error) {
    console.log("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(501).json({ message: "Google OAuth not configured" });
    }
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: ENV.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    let user = await User.findOne({
      where: {
        [Op.or]: [{ oauthGoogleId: payload.sub }, { email: payload.email }],
      },
    });

    if (!user) {
      user = await User.create({
        fullName: payload.name,
        email: payload.email,
        oauthGoogleId: payload.sub,
        profilePic: payload.picture || "",
      });
    } else if (!user.oauthGoogleId) {
      user.oauthGoogleId = payload.sub;
      await user.save();
    }

    generateToken(user.id, res);
    res.json(formatAuthUser(user));
  } catch (error) {
    res.status(401).json({ message: "Google auth failed" });
  }
};

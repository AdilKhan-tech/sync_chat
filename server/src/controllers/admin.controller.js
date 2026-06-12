import User from "../models/User.js";
import Message from "../models/Message.js";
import Report from "../models/Report.js";

export const getStats = async (_req, res) => {
  try {
    const [users, messages, reports] = await Promise.all([
      User.countDocuments(),
      Message.countDocuments(),
      Report.countDocuments({ status: "pending" }),
    ]);
    res.json({ users, messages, pendingReports: reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Message.deleteMany({
      $or: [{ senderId: req.params.id }, { receiverId: req.params.id }],
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReports = async (_req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporterId", "fullName email")
      .populate("reportedUserId", "fullName email")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

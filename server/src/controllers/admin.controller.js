import { Op } from "sequelize";
import User from "../models/User.js";
import Message from "../models/Message.js";
import Report from "../models/Report.js";

export const getStats = async (_req, res) => {
  try {
    const [users, messages, reports] = await Promise.all([
      User.count(),
      Message.count(),
      Report.count({ where: { status: "pending" } }),
    ]);
    res.json({ users, messages, pendingReports: reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "twoFactorSecret", "resetPasswordToken", "resetPasswordExpires"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(users.map((u) => ({ ...u.get({ plain: true }), _id: u.id })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    await Message.destroy({
      where: {
        [Op.or]: [{ senderId: req.params.id }, { receiverId: req.params.id }],
      },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReports = async (_req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: User, as: "reporter", attributes: ["id", "fullName", "email"] },
        { model: User, as: "reportedUser", attributes: ["id", "fullName", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(
      reports.map((report) => {
        const plain = report.get({ plain: true });
        return {
          ...plain,
          _id: plain.id,
          reporterId: plain.reporter
            ? { _id: plain.reporter.id, fullName: plain.reporter.fullName, email: plain.reporter.email }
            : plain.reporterId,
          reportedUserId: plain.reportedUser
            ? {
                _id: plain.reportedUser.id,
                fullName: plain.reportedUser.fullName,
                email: plain.reportedUser.email,
              }
            : plain.reportedUserId,
        };
      }),
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

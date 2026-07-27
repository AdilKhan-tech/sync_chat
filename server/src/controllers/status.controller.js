import { Op } from "sequelize";
import Status from "../models/Status.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getIO } from "../lib/socket.js";
import StatusView from "../models/StatusView.js";
import StatusReply from "../models/StatusReply.js";

const uploadStatusMedia = async (file, resourceType = "image") => {
  if (!file) return null;

  const result = await cloudinary.uploader.upload(file, {
    resource_type: resourceType,
    timeout: 120000,
  });

  return result.secure_url;
};

export const createStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const { type, text, image, video, backgroundColor, fontColor, privacy } =
      req.body;

    if (!type) {
      return res.status(400).json({
        message: "Status type is required",
      });
    }

    let imageUrl = null;
    let videoUrl = null;

    if (type === "image") {
      if (!image) {
        return res.status(400).json({
          message: "Image is required",
        });
      }

      imageUrl = await uploadStatusMedia(image, "image");
    }

    if (type === "video") {
      if (!video) {
        return res.status(400).json({
          message: "Video is required",
        });
      }

      videoUrl = await uploadStatusMedia(video, "video");
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const status = await Status.create({
      userId,
      type,
      text: text || "",
      image: imageUrl,
      video: videoUrl,
      backgroundColor: backgroundColor || "#075E54",
      fontColor: fontColor || "#FFFFFF",
      privacy: privacy || "contacts",
      expiresAt,
    });

    const completeStatus = await Status.findByPk(status.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "profilePic"],
        },
      ],
    });

    getIO().emit("status:new", completeStatus);

    return res.status(201).json({
      success: true,
      message: "Status uploaded successfully",
      status: completeStatus,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyStatus = async (req, res) => {
  try {
    const statuses = await Status.findAll({
      where: {
        userId: req.user._id,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "profilePic"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json(statuses);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Status Feed
|--------------------------------------------------------------------------
*/

export const getStatusFeed = async (req, res) => {
  try {
    const myId = req.user._id;

    const statuses = await Status.findAll({
      where: {
        userId: {
          [Op.ne]: myId,
        },
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },

      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "profilePic", "presenceStatus"],
        },

        {
          model: StatusView,
          as: "views",
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    const response = statuses.map((status) => {
      const plain = status.get({ plain: true });

      plain.isViewed = plain.views.some(
        (v) => Number(v.viewerId) === Number(myId),
      );

      plain.viewsCount = plain.views.length;

      delete plain.views;

      return plain;
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| View Status
|--------------------------------------------------------------------------
*/

export const viewStatus = async (req, res) => {
  try {
    const myId = req.user._id;

    const { statusId } = req.params;

    const status = await Status.findByPk(statusId);

    if (!status) {
      return res.status(404).json({
        message: "Status not found",
      });
    }

    const alreadyViewed = await StatusView.findOne({
      where: {
        statusId,
        viewerId: myId,
      },
    });

    if (!alreadyViewed) {
      await StatusView.create({
        statusId,
        viewerId: myId,
      });

      getIO().emit("status:view", {
        statusId,
        viewerId: myId,
      });
    }

    res.json({
      success: true,
      message: "Viewed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Status Views
|--------------------------------------------------------------------------
*/

export const getStatusViews = async (req, res) => {
  try {
    const { statusId } = req.params;

    const status = await Status.findByPk(statusId);

    if (!status) {
      return res.status(404).json({
        message: "Status not found",
      });
    }

    if (Number(status.userId) !== Number(req.user._id)) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const views = await StatusView.findAll({
      where: {
        statusId,
      },

      include: [
        {
          model: User,
          as: "viewer",
          attributes: ["id", "fullName", "profilePic"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.json(views);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Reply Status
|--------------------------------------------------------------------------
*/

export const replyStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        message: "Reply message is required",
      });
    }

    const status = await Status.findByPk(statusId);

    if (!status) {
      return res.status(404).json({
        message: "Status not found",
      });
    }

    const reply = await StatusReply.create({
      statusId,
      senderId: req.user._id,
      receiverId: status.userId,
      message: message.trim(),
    });

    const completeReply = await StatusReply.findByPk(reply.id, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "fullName", "profilePic"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "fullName", "profilePic"],
        },
      ],
    });

    console.log("Sending reply to user:", status.userId);
    console.log("Reply Data:", completeReply);

    getIO().to(String(status.userId)).emit("status:reply", completeReply);

    res.status(201).json({
      success: true,
      reply: completeReply,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Status
|--------------------------------------------------------------------------
*/

export const deleteStatus = async (req, res) => {
  try {
    const { statusId } = req.params;

    const status = await Status.findByPk(statusId);

    if (!status) {
      return res.status(404).json({
        message: "Status not found",
      });
    }

    if (Number(status.userId) !== Number(req.user._id)) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await StatusView.destroy({
      where: {
        statusId,
      },
    });

    await StatusReply.destroy({
      where: {
        statusId,
      },
    });

    await status.destroy();

    getIO().emit("status:delete", {
      statusId,
    });

    res.json({
      success: true,
      message: "Status deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

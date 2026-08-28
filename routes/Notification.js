const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Create Notification
router.post("/", async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    if (!userId || !message || !type) {
      return res.status(400).json({
        success: false,
        message: "userId, message and type are required",
      });
    }

    const newNotification = new Notification({
      userId,
      message,
      type,
    });

    const savedNotification = await newNotification.save();

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: savedNotification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Get All Notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Get Notifications by User
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Delete All Notifications
router.delete("/all", async (req, res) => {
  try {
    const result = await Notification.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All Notifications deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting notifications:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Delete Notification
router.delete("/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Edit Notification
router.put("/:id", async (req, res) => {
  try {
    const { userId, message, type, read } = req.body;

    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        userId,
        message,
        type,
        read,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedNotification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification updated successfully",
      data: updatedNotification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Mark Notification as Read
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;

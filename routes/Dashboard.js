const express = require("express");
const router = express.Router();

const Lead = require("../models/Lead");
const Meeting = require("../models/Meeting");
const Task = require("../models/Task");
const Deal = require("../models/Deal");

// GET Dashboard Data
router.get("/", async (req, res) => {
  try {
    const now = new Date();

    // Start of today
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // End of today
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Start of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // End of current month
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // Upcoming meetings
    const meetings = await Meeting.find({
      from: { $gte: now },
    })
      .sort({ from: 1 })
      .limit(10)
      .lean();

    // Open tasks
    const tasks = await Task.find({
      status: { $ne: "Completed" },
    })
      .sort({ due: 1 })
      .limit(10)
      .lean();

    console.log("task completed found : ", tasks);

    // Today's leads
    const leads = await Lead.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Deals closing this month
    const deals = await Deal.find({
      closeDate: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    })
      .sort({ closeDate: 1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      leads,
      meetings,
      tasks,
      deals,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting");

// Create Meeting
router.post("/", async (req, res) => {
  try {
    const { meetingName, meetingVenue, from, to } = req.body;

    if (!meetingName || !meetingVenue || !from || !to) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newMeeting = new Meeting({
      meetingName,
      meetingVenue,
      from,
      to,
    });

    const savedMeeting = await newMeeting.save();

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data: savedMeeting,
    });
  } catch (error) {
    console.error("Error creating meeting:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Get All Meetings
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find();

    res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings,
    });
  } catch (error) {
    console.error("Error fetching meetings:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

router.delete("/all", async (req, res) => {
  try {
    const result = await Meeting.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All Meetings deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting meeting:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting meeting:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Edit Meeting
router.put("/:id", async (req, res) => {
  try {
    const { meetingName, meetingVenue, from, to } = req.body;

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        meetingName,
        meetingVenue,
        from,
        to,
      },
      {
        new: true, // return updated document
        runValidators: true,
      }
    );

    if (!updatedMeeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      data: updatedMeeting,
    });
  } catch (error) {
    console.error("Error updating meeting:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;

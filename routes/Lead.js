const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");

// Create Task
router.post("/", async (req, res) => {
  try {
    const { leadowner, firstname, lastname, phone } = req.body;

    // if (!owner || !subject || !status || !due || !priority) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "All fields are required",
    //   });
    // }

    const task = new Lead({
      leadowner,
      firstname,
      lastname,
      phone,
    });

    const savedTask = await task.save();

    res.status(201).json({
      success: true,
      message: "lead created successfully",
      data: savedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Get All Tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Lead.find();

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Delete All Tasks
router.delete("/all", async (req, res) => {
  try {
    const result = await Lead.deleteMany({});

    console.log("result : ", result);

    res.status(200).json({
      success: true,
      message: "All Leads deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Update Task
router.put("/:id", async (req, res) => {
  try {
    const { leadowner, firstname, lastname, phone } = req.body;

    const updatedTask = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        leadowner,
        firstname,
        lastname,
        phone,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating Lead:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Delete Task By ID
router.delete("/:id", async (req, res) => {
  try {
    const task = await Lead.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;

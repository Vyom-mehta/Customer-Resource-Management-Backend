const express = require("express");
const router = express.Router();
const Deal = require("../models/Deal");

// Create Deal
router.post("/", async (req, res) => {
  try {
    const { name, company, stage, closeDate, dealValue } = req.body;

    const newDeal = new Deal({
      name,
      company,
      stage,
      closeDate,
      dealValue,
    });

    const savedDeal = await newDeal.save();

    res.status(201).json({
      success: true,
      message: "Deal created successfully",
      data: savedDeal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Get All Deals
router.get("/", async (req, res) => {
  try {
    const deals = await Deal.find();

    res.status(200).json({
      success: true,
      count: deals.length,
      data: deals,
    });
  } catch (error) {
    console.error("Error fetching deals:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Update Deal
router.put("/:id", async (req, res) => {
  try {
    const { name, company, stage, closeDate, dealValue } = req.body;

    const updatedDeal = await Deal.findByIdAndUpdate(
      req.params.id,
      {
        name,
        company,
        stage,
        closeDate,
        dealValue,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDeal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deal updated successfully",
      data: updatedDeal,
    });
  } catch (error) {
    console.error("Error updating deal:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Get Single Deal
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deal = await Deal.findById(id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    res.status(200).json({
      success: true,
      data: deal,
    });
  } catch (error) {
    console.error("Error fetching deal:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Delete All Deals
router.delete("/all", async (req, res) => {
  try {
    const result = await Deal.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All deals deleted successfully",
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

// Delete Single Deal
router.delete("/:id", async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting deal:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;

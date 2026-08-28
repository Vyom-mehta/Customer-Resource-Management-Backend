const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");

// Create Meeting
router.post("/", async (req, res) => {
  try {
    const {
      name,
      type,
      status,
      budget,
      expectedRevenue,
      actualRevenue,
      startDate,
      endDate,
    } = req.body;

    const newCampaign = new Campaign({
      name,
      type,
      status,
      budget,
      expectedRevenue,
      actualRevenue,
      startDate,
      endDate,
    });

    const savedCampaign = await newCampaign.save();

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      data: savedCampaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find();

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns,
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

router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      type,
      status,
      budget,
      expectedRevenue,
      actualRevenue,
      startDate,
      endDate,
    } = req.body;

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        status,
        budget,
        expectedRevenue,
        actualRevenue,
        startDate,
        endDate,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCampaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      data: updatedCampaign,
    });
  } catch (error) {
    console.error("Error updating campaign:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.log("Error fetching campaign:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.delete("/all", async (req, res) => {
  try {
    const result = await Campaign.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All campaigns deleted successfully",
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

router.delete("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting campaign:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;

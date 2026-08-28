const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchText = query.trim();

    // Collections and fields that can be searched
    const searchableCollections = [
      {
        collection: "Lead",
        match: "leads",
        fields: ["name", "email", "phone", "company"],
      },
      {
        collection: "Meeting",
        match: "meetings",
        fields: ["title", "description", "email"],
      },
      {
        collection: "Campaign",
        match: "campaigns",
        fields: ["name", "description"],
      },
      {
        collection: "Contact",
        match: "contacts",
        fields: ["name", "email", "phone", "company"],
      },
      {
        collection: "Deal",
        match: "deals",
        fields: ["name", "email", "company"],
      },
      {
        collection: "Task",
        match: "tasks",
        fields: ["title", "description"],
      },
      {
        collection: "Account",
        match: "accounts",
        fields: ["name", "email", "phone", "company"],
      },
    ];

    const regex = new RegExp(searchText, "i");

    for (const item of searchableCollections) {
      const collection = mongoose.connection.db.collection(item.collection);

      const conditions = item.fields.map((field) => ({
        [field]: regex,
      }));

      const result = await collection.findOne(
        { $or: conditions },
        { projection: { _id: 1 } }
      );

      if (result) {
        return res.json({
          success: true,
          match: item.match,
          id: result._id,
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: "No matching record found",
    });
  } catch (error) {
    console.error("Search error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;

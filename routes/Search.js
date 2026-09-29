const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    console.log("query:", query);

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchText = query.trim();

    const searchableCollections = [
      {
        collection: "leads",
        type: "leads",
        fields: ["name", "email", "phone", "company"],
        titleField: "name",
        subtitleFields: ["email", "company"],
      },
      {
        collection: "meetings",
        type: "meetings",
        fields: ["title", "description", "email"],
        titleField: "title",
        subtitleFields: ["email", "description"],
      },
      {
        collection: "campaigns",
        type: "campaigns",
        fields: ["name", "description"],
        titleField: "name",
        subtitleFields: ["description"],
      },
      {
        collection: "deals",
        type: "deals",
        fields: ["name", "company"],
        titleField: "name",
        subtitleFields: ["company"],
      },
      {
        collection: "contacts",
        type: "contacts",
        fields: ["name", "email", "phone"],
        titleField: "name",
        subtitleFields: ["email", "phone"],
      },
      {
        collection: "tasks",
        type: "tasks",
        fields: ["subject", "owner"],
        titleField: "subject",
        subtitleFields: ["owner"],
      },
      {
        collection: "accounts",
        type: "accounts",
        fields: ["name", "number", "website"],
        titleField: "name",
        subtitleFields: ["number", "website"],
      },
    ];

    const regex = new RegExp(searchText, "i");

    const allResults = [];

    for (const item of searchableCollections) {
      // Give me the accounts collection from my MongoDB database.
      const collection = mongoose.connection.db.collection(item.collection);

      const conditions = item.fields.map((field) => ({
        [field]: regex,
      }));

      console.log("conditions : ", conditions);

      const results = await collection
        .find(
          { $or: conditions },
          {
            projection: {
              _id: 1,
              ...item.fields.reduce((projection, field) => {
                projection[field] = 1;
                return projection;
              }, {}),
            },
          }
        )
        .limit(20)
        .toArray();

      results.forEach((result) => {
        console.log("result : ", result);
        const subtitle = item.subtitleFields
          .map((field) => result[field])
          .filter(Boolean)
          .join(" • ");

        allResults.push({
          id: result._id,
          type: item.type,
          title: result[item.titleField] || "Untitled",
          subtitle: subtitle || "",
        });
      });
    }

    if (allResults.length === 0) {
      return res.status(200).json({
        success: true,
        found: false,
        results: [],
        message: "No matching record found",
      });
    }

    return res.status(200).json({
      success: true,
      found: true,
      count: allResults.length,
      results: allResults,
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

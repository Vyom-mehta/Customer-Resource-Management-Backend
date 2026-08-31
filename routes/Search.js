// const express = require("express");
// const mongoose = require("mongoose");

// const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const { query } = req.query;

//     console.log("query : ", query);

//     if (!query || !query.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Search query is required",
//       });
//     }

//     const searchText = query.trim();

//     // Collections and fields that can be searched
//     const searchableCollections = [
//       {
//         collection: "Lead",
//         match: "leads",
//         fields: ["name", "email", "phone", "company"],
//       },
//       {
//         collection: "Meeting",
//         match: "meetings",
//         fields: ["title", "description", "email"],
//       },
//       {
//         collection: "Campaign",
//         match: "campaigns",
//         fields: ["name", "description"],
//       },
//       {
//         //
//         collection: "deals",
//         match: "deals",
//         fields: ["name", "company"],
//       },
//       {
//         //
//         collection: "contacts",
//         match: "contacts",
//         fields: ["name", "email", "phone"],
//       },

//       {
//         //
//         collection: "tasks",
//         match: "tasks",
//         fields: ["subject", "owner"],
//       },
//       {
//         //
//         collection: "accounts",
//         match: "accounts",
//         fields: ["name", "number", "website"],
//       },
//     ];

//     const regex = new RegExp(searchText, "i");

//     for (const item of searchableCollections) {
//       const collection = mongoose.connection.db.collection(item.collection);

//       const conditions = item.fields.map((field) => ({
//         [field]: regex,
//       }));

//       const result = await collection.findOne(
//         { $or: conditions },
//         { projection: { _id: 1 } }
//       );

//       console.log("result : ", result);

//       if (result) {
//         return res.json({
//           success: true,
//           match: item.match,
//           id: result._id,
//         });
//       }
//     }

//     return res.status(200).json({
//       success: false,
//       message: "No matching record found",
//     });
//   } catch (error) {
//     console.error("Search error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });

// module.exports = router;

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
      const collection = mongoose.connection.db.collection(item.collection);

      const conditions = item.fields.map((field) => ({
        [field]: regex,
      }));

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

      console.log(`${item.collection} results:`, results.length);

      results.forEach((result) => {
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

const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
    },

    status: {
      type: String,
    },

    budget: {
      type: Number,
      required: true,
    },

    expectedRevenue: {
      type: Number,
      required: true,
    },

    actualRevenue: {
      type: Number,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);

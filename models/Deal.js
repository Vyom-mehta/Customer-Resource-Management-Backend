const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const dealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    stage: {
      type: String,
      required: true,
      enum: [
        "Qualification",
        "Need Analysis",
        "Negotiation",
        "Closed Won",
        "Closed Lost",
      ],
    },

    closeDate: {
      type: Date,
      required: true,
    },

    dealValue: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);

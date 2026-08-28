const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    number: {
      type: String,
      required: true,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },

    type: {
      type: String,
      enum: ["Customer", "Prospect", "Partner", "Vendor", "Other"],
      default: "Customer",
    },

    revenue: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", accountSchema);

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
      trim: true,
    },  

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Completed"],
      default: "To Do",
    },

    due: {
      type: Date,
      required: true,
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);

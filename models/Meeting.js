const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    meetingName: {
      type: String,
      required: true,
    },
    meetingVenue: {
      type: String,
      required: true,
    },
    from: {
      type: Date,
      required: true,
    },

    to: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);

const express = require("express");
const cors = require("cors");
const db = require("./db");
const userRoutes = require("./routes/User");
const campaignRoutes = require("./routes/campaign");
const meetingRoutes = require("./routes/meeting");
const contactRoutes = require("./routes/Contact");
const taskRoutes = require("./routes/Task");
const accountRoutes = require("./routes/Account");
const leadRoutes = require("./routes/Lead");
const dashboardRoutes = require("./routes/dashboard.js");
const dealRoutes = require("./routes/Deal");
const notificationRoutes = require("./routes/Notification");
const searchRoutes = require("./routes/Search.js");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", userRoutes);
app.use("/task", taskRoutes);
app.use("/meeting", meetingRoutes);
app.use("/contact", contactRoutes);
app.use("/campaign", campaignRoutes);
app.use("/account", accountRoutes);
app.use("/lead", leadRoutes);
app.use("/deal", dealRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/notification", notificationRoutes);
app.use("/search", searchRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

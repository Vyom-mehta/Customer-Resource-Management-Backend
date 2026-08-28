const mongoose = require("mongoose");
const mongoURL = "mongodb://localhost:27017/crm";

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("connected to MongoDb server");
});

db.on("error", () => {
  console.log("error connecting to MongoDb server");
});

db.on("disconnected", () => {
  console.log("disconnected  to MongoDb server");
});

module.exports = db;

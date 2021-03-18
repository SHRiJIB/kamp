const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const app = express();

mongoose.connect("mongodb://localhost:27017/Scamp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error!!"));
db.once("open", () => {
  console.log("MONGO IS ONNN!!!");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecamps", async (req, res) => {
  const camp = new Campground({ title: "My backyard" });
  await camp.save();
  res.send(JSON.stringify(camp));
});
app.listen(3000, () => {
  console.log("SERVER IS RUNNIG ON PORT 3000");
});

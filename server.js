const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const interestRoutes = require("./routes/interestRoutes");
const historyRoutes = require("./routes/historyRoutes");
const profileRoutes = require("./routes/profileRoutes");
const upgradeRoutes = require("./routes/upgradeRoutes");
const seedInterests = require("./utils/seedInterests");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Learning Assistant Backend is running");
});

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend test route works",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", interestRoutes);
app.use("/api", historyRoutes);
app.use("/api", profileRoutes);
app.use("/api", upgradeRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB Atlas");

    await seedInterests();

    const port = process.env.PORT || 5001;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
const express = require("express");
const History = require("../models/History");

const router = express.Router();

router.post("/history", async (req, res) => {
  try {
    const {
      userId,
      interestId,
      interestName,
      questionText,
      selectedAnswer,
      correctAnswer,
      correct,
    } = req.body;

    if (
      !userId ||
      !interestName ||
      !questionText ||
      !selectedAnswer ||
      !correctAnswer ||
      typeof correct !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required history fields.",
      });
    }

    const history = await History.create({
      userId,
      interestId,
      interestName,
      questionText,
      selectedAnswer,
      correctAnswer,
      correct,
    });

    return res.status(201).json({
      success: true,
      message: "History saved successfully.",
      history,
    });
  } catch (error) {
    console.error("Save history error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while saving history.",
    });
  }
});

router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const histories = await History.find({ userId })
      .sort({ createdAt: -1 })
      .populate("interestId");

    return res.json({
      success: true,
      histories,
    });
  } catch (error) {
    console.error("Get history error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while getting history.",
    });
  }
});

module.exports = router;
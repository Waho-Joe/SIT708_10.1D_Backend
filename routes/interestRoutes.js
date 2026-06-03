const express = require("express");

const Interest = require("../models/Interest");
const UserInterest = require("../models/UserInterest");

const router = express.Router();

router.get("/interests", async (req, res) => {
  try {
    const interests = await Interest.find().sort({ name: 1 });

    return res.json({
      success: true,
      interests,
    });
  } catch (error) {
    console.error("Get interests error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while getting interests.",
    });
  }
});

router.post("/users/:userId/interests", async (req, res) => {
  try {
    const { userId } = req.params;
    const { interestIds } = req.body;

    if (!interestIds || !Array.isArray(interestIds) || interestIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one interest.",
      });
    }

    if (interestIds.length > 10) {
      return res.status(400).json({
        success: false,
        message: "You can select up to 10 interests only.",
      });
    }

    const validInterests = await Interest.find({
      _id: { $in: interestIds },
    });

    if (validInterests.length !== interestIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some interest IDs are invalid.",
      });
    }

    const saved = await UserInterest.findOneAndUpdate(
      { userId },
      {
        userId,
        interestIds,
      },
      {
        returnDocument: "after",
        upsert: true,
      }
    ).populate("interestIds");

    return res.json({
      success: true,
      message: "Interests saved successfully.",
      userId: saved.userId,
      interests: saved.interestIds,
    });
  } catch (error) {
    console.error("Save interests error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while saving interests.",
    });
  }
});

router.get("/users/:userId/interests", async (req, res) => {
  try {
    const { userId } = req.params;

    const userInterest = await UserInterest.findOne({ userId }).populate("interestIds");

    if (!userInterest) {
      return res.json({
        success: true,
        interests: [],
      });
    }

    return res.json({
      success: true,
      interests: userInterest.interestIds,
    });
  } catch (error) {
    console.error("Get user interests error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while getting user interests.",
    });
  }
});

module.exports = router;
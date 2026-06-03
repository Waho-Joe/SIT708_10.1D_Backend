const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");

const User = require("../models/User");
const History = require("../models/History");
const PublicProfile = require("../models/PublicProfile");

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function cleanUsernameForPublicId(username) {
  return username
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function generateUniquePublicId(username) {
  let publicId;
  let exists = true;

  const safeUsername = cleanUsernameForPublicId(username) || "user";

  while (exists) {
    const randomPart = crypto.randomBytes(8).toString("hex");
    publicId = `${safeUsername}-${randomPart}`;

    exists = await PublicProfile.findOne({ publicId });
  }

  return publicId;
}

async function buildProfileSummary(userId) {
  if (!isValidObjectId(userId)) {
    return {
      error: "Invalid user ID format.",
    };
  }

  const user = await User.findById(userId);

  if (!user) {
    return null;
  }

  const totalQuestions = await History.countDocuments({ userId });

  const correctAnswers = await History.countDocuments({
    userId,
    correct: true,
  });

  const incorrectAnswers = await History.countDocuments({
    userId,
    correct: false,
  });

  return {
    userId: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    membershipLevel: user.membershipLevel,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
  };
}

router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await buildProfileSummary(userId);

    if (profile && profile.error) {
      return res.status(400).json({
        success: false,
        message: profile.error,
      });
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while getting profile.",
    });
  }
});

router.post("/profile/share/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await buildProfileSummary(userId);

    if (profile && profile.error) {
      return res.status(400).json({
        success: false,
        message: profile.error,
      });
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let publicProfile = await PublicProfile.findOne({
      userId: profile.userId,
    });

    if (!publicProfile) {
      const publicId = await generateUniquePublicId(profile.username);

      publicProfile = await PublicProfile.create({
        publicId,
        userId: profile.userId,
        username: profile.username,
        membershipLevel: profile.membershipLevel,
        totalQuestions: profile.totalQuestions,
        correctAnswers: profile.correctAnswers,
        incorrectAnswers: profile.incorrectAnswers,
      });
    } else {
      publicProfile.username = profile.username;
      publicProfile.membershipLevel = profile.membershipLevel;
      publicProfile.totalQuestions = profile.totalQuestions;
      publicProfile.correctAnswers = profile.correctAnswers;
      publicProfile.incorrectAnswers = profile.incorrectAnswers;

      await publicProfile.save();
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const publicUrl = `${baseUrl}/public/profile/${publicProfile.publicId}`;

    return res.json({
      success: true,
      message: "Public profile link generated successfully.",
      publicUrl,
      publicProfile,
    });
  } catch (error) {
    console.error("Share profile error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Public profile ID conflict. Please try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while generating public profile.",
    });
  }
});

router.get("/public/profile/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId || publicId.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Invalid public profile ID.",
      });
    }

    const publicProfile = await PublicProfile.findOne({ publicId });

    if (!publicProfile) {
      return res.status(404).json({
        success: false,
        message: "Public profile not found.",
      });
    }

    return res.json({
      success: true,
      publicProfile: {
        username: publicProfile.username,
        membershipLevel: publicProfile.membershipLevel,
        totalQuestions: publicProfile.totalQuestions,
        correctAnswers: publicProfile.correctAnswers,
        incorrectAnswers: publicProfile.incorrectAnswers,
        updatedAt: publicProfile.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get public profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while getting public profile.",
    });
  }
});

module.exports = router;
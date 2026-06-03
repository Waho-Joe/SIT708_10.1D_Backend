const express = require("express");
const User = require("../models/User");

const router = express.Router();

const allowedPlans = ["Free", "Starter", "Intermediate", "Advanced", "Premium"];

router.post("/users/:userId/upgrade", async (req, res) => {
  try {
    const { userId } = req.params;
    const { membershipLevel } = req.body;

    if (!membershipLevel || !allowedPlans.includes(membershipLevel)) {
      return res.status(400).json({
        success: false,
        message: "Invalid membership level.",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { membershipLevel },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "Account upgraded successfully.",
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        membershipLevel: user.membershipLevel,
      },
    });
  } catch (error) {
    console.error("Upgrade error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while upgrading account.",
    });
  }
});

module.exports = router;
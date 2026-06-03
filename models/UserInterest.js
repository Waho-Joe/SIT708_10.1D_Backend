const mongoose = require("mongoose");

const userInterestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    interestIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interest",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserInterest", userInterestSchema);
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interest",
      required: false,
    },

    interestName: {
      type: String,
      required: true,
      trim: true,
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    selectedAnswer: {
      type: String,
      required: true,
      trim: true,
    },

    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },

    correct: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", historySchema);
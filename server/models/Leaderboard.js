const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const leaderboardSchema = new mongoose.Schema({
  player: {
    type: mongoose.Types.ObjectId,
  },
  wins: {
    type: Number,
  },
  losses: {
    type: Number,
  },
  draws: {
    type: Number,
  },
});

module.exports = mongoose.model("leaderboard", leaderboardSchema);

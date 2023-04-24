const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const leaderboardSchema = new mongoose.Schema({
  player: {
    type: mongoose.Types.ObjectId,
  },
  username: {
    type: String,
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
  elo: {
    type: Number,
  },
});

module.exports = mongoose.model("leaderboard", leaderboardSchema);

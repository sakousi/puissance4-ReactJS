const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  player1: {
    id: {
      type: mongoose.Types.ObjectId,
    },
    username: {
      type: String,
    },
    elo: {
      type: Number,
    },
  },
  player2: {
    id: {
      type: mongoose.Types.ObjectId,
    },
    username: {
      type: String,
    },
    elo: {
      type: Number,
    },
  },
  winner: {
    type: mongoose.Types.ObjectId,
  },
  dateStarted: {
    type: Date,
  },
  eloChange: {
    player1EloChange: {
      type: Number,
    },
    player2EloChange: {
      type: Number,
    },
  },
});

module.exports = mongoose.model("game", gameSchema);

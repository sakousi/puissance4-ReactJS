const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  player1: {
    type: mongoose.Types.ObjectId,
  },
  player2: {
    type: mongoose.Types.ObjectId,
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

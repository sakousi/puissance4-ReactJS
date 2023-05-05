const { updateGameData } = require("../graphql/Game/mutations.js");
const {
  updateLeaderboardData,
} = require("../graphql/Leaderboard/mutations.js");
const { getUserByIdData } = require("../graphql/User/queries.js");

async function updateStatistics(firstPlayer, secondPlayer, result, k = 32) {
  if (!firstPlayer || !secondPlayer || !result) {
    throw new Error("Invalid input parameters");
  }

  const player1 = await getUserByIdData({ id: firstPlayer.id });
  const player2 = await getUserByIdData({ id: secondPlayer.id });

  if (!player1 || !player2 || player1._id === player2._id) {
    throw new Error("Invalid player data");
  }

  // Calculate expected scores for both players
  const expectedScorePlayer1 =
    1 / (1 + Math.pow(10, (player2.elo - player1.elo) / 400));
  const expectedScorePlayer2 =
    1 / (1 + Math.pow(10, (player1.elo - player2.elo) / 400));

  // Update ELO scores based on the result
  const player1Won = result === "player1Wins";
  const draw = result === "draw";

  const newPlayer1Elo =
    player1.elo + k * ((player1Won ? 1 : 0) - expectedScorePlayer1);
  const newPlayer2Elo =
    player2.elo +
    k * ((draw ? 0.5 : player1Won ? 0 : 1) - expectedScorePlayer2);

  const newElo = {
    player1EloChange: Math.round(newPlayer1Elo - player1.elo),
    player2EloChange: Math.round(newPlayer2Elo - player2.elo),
  };

  const newPlayer1 = {
    id: player1._id,
    username: player1.username,
    elo: Math.round(player1.elo),
  };

  const newPlayer2 = {
    id: player2._id,
    username: player2.username,
    elo: Math.round(player2.elo),
  };

  // Update leaderboard data for both players
  updateLeaderboardData({
    player: player1._id,
    username: player1.username,
    wins: player1Won ? 1 : 0,
    losses: 0,
    draws: draw ? 1 : 0,
    elo: Math.round(newPlayer1Elo),
  });
  updateLeaderboardData({
    player: player2._id,
    username: player2.username,
    wins: 0,
    losses: player1Won ? 1 : 0,
    draws: draw ? 1 : 0,
    elo: Math.round(newPlayer2Elo),
  });

  // Update game data
  updateGameData({
    player1: newPlayer1,
    player2: newPlayer2,
    winner: player1Won ? player1._id : null,
    dateStarted: new Date(),
    eloChange: newElo,
  });
}

module.exports = { updateStatistics };

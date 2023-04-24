const {
  updateLeaderboardData,
} = require("../graphql/Leaderboard/mutations.js");
const { getUserByIdData } = require("../graphql/User/queries.js");

async function updateElo(firstPlayer, secondPlayer, result, k = 32) {
  if (firstPlayer && secondPlayer && result) {
    const player1 = await getUserByIdData({ id: firstPlayer.id });
    const player2 = await getUserByIdData({ id: secondPlayer.id });

    if (player1 && player2) {
      // Calculer la probabilité attendue pour chaque joueur
      const expectedScorePlayer1 =
        1 / (1 + Math.pow(10, (player2.elo - player1.elo) / 400));
      const expectedScorePlayer2 =
        1 / (1 + Math.pow(10, (player1.elo - player2.elo) / 400));

      // Mettre à jour les scores ELO en fonction du résultat
      let newPlayer1Elo, newPlayer2Elo;
      if (result === "player1Wins") {
        newPlayer1Elo = player1.elo + k * (1 - expectedScorePlayer1);
        newPlayer2Elo = player2.elo + k * (0 - expectedScorePlayer2);
      } else if (result === "player2Wins") {
        newPlayer1Elo = player1.elo + k * (0 - expectedScorePlayer1);
        newPlayer2Elo = player2.elo + k * (1 - expectedScorePlayer2);
      } else if (result === "draw") {
        newPlayer1Elo = player1.elo + k * (0.5 - expectedScorePlayer1);
        newPlayer2Elo = player2.elo + k * (0.5 - expectedScorePlayer2);
      } else {
        throw new Error("Invalid result value");
      }

      updateLeaderboardData({
        player: player1._id,
        username: player1.username,
        wins: result === "player1Wins" ? 1 : 0,
        losses: 0,
        draws: result === "draw" ? 1 : 0,
        elo: Math.round(newPlayer1Elo),
      });
      updateLeaderboardData({
        player: player2._id,
        username: player2.username,
        wins: 0,
        losses: result === "player1Wins" ? 1 : 0,
        draws: result === "draw" ? 1 : 0,
        elo: Math.round(newPlayer2Elo),
      });
    }
  }
}

module.exports = { updateElo };

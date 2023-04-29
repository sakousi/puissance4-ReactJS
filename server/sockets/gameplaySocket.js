// gameplaySocket.js
const { updateElo } = require("../utils/elo.js");

module.exports = (
  socket,
  io,
  rooms,
  customRooms,
  findRoomById,
  findCustomRoomById
) => {
  socket.on("move", (colPlayed) => {
    let room;
    room = findRoomById(socket.id, rooms);
    if (!room) {
      room = findCustomRoomById(socket.id, customRooms);
    }
    let playerIndex = room.players.findIndex(
      (player) => player.socketId === socket.id
    );
    let opponentIndex = room.players.findIndex(
      (player) => player.socketId !== socket.id
    );
    let player = room.players[playerIndex];

    if (room.board && player.turn) {
      for (let i = 0; i < room?.board[colPlayed]?.length; i++) {
        if (room.board[colPlayed][i] === 0) {
          room.board[colPlayed][i] = socket.id;

          const playedCell = {
            column: Number(colPlayed),
            row: i,
          };
          room.cellsPlayed++;

          room.players[playerIndex].turn = false;
          room.players[opponentIndex].turn = true;

          const winner = getWinner(colPlayed, i, room.board);

          if (winner || room.cellsPlayed === 42) {

            let draw = false;
            if (room.cellsPlayed === 42) {
              draw = true;
            }

            const player1 = {
              elo: player.elo,
              username: player.userName,
              id: player.id,
            };
            const player2 = {
              elo: room.players[opponentIndex].elo,
              username: player.userName,
              id: room.players[opponentIndex].id,
            };

            if (player1.id && player2.id) {
              if (winner) {
                updateElo(player1, player2, "player1Wins");
              } else if (draw) {
                updateElo(player1, player2, "draw");
              }
            }

            room.players[opponentIndex].turn = false;

            io.to(room?.id).emit("victory", winner ? socket.id : null, draw);
          }

          return io
            .to(room?.id)
            .emit("move", room.board, playedCell, socket.id, room.players);
        }
      }
    }
  });

  socket.on("play-again", (playerWantsToRestartId) => {
    let room;
    room = findRoomById(socket.id, rooms);
    if (!room) {
      room = findCustomRoomById(socket.id, customRooms);
    }
    io.to(room?.id).emit("play-again", playerWantsToRestartId);
  });

  socket.on("startGame", (board) => {
    let room;
    room = findRoomById(socket.id, rooms);
    if (!room) {
      room = findCustomRoomById(socket.id, customRooms);
    }
    if (board) {
      room.board = board;
      room.cellsPlayed = 0;
    }
    const firstPlayerIndex = Math.random() < 0.5 ? 0 : 1;
    room.players.forEach((player, index) => {
      player.turn = index === firstPlayerIndex;
    });

    io.to(room?.id).emit("startGame", room.players);
  });

  socket.on("checkWin", (data) => {
    // Logic to check if game is won
    // Emit event to notify players of win/loss
  });

  // ... other gameplay events
};

function getWinner(column, row, board) {
  // Récupérer l'identifiant du joueur dans la cellule sélectionnée
  const playerId = board[column][row];
  if (playerId === 0) return false;

  // Définir les directions à vérifier (horizontal, vertical, diagonales)
  const directions = [
    { dx: 1, dy: 0 }, // horizontal
    { dx: 0, dy: 1 }, // vertical
    { dx: 1, dy: 1 }, // diagonal \
    { dx: 1, dy: -1 }, // diagonal /
  ];

  // Parcourir toutes les directions
  for (const { dx, dy } of directions) {
    let count = 0;
    // Parcourir les cellules autour de la cellule sélectionnée
    for (let step = -3; step <= 3; step++) {
      const col = column + step * dx;
      const r = row + step * dy;

      // Vérifier si la cellule courante est à l'intérieur du plateau
      // et si elle contient le jeton du même joueur
      if (
        col >= 0 &&
        col < board.length &&
        r >= 0 &&
        r < board[0].length &&
        board[col][r] === playerId
      ) {
        // Augmenter le compteur s'il y a un jeton du même joueur
        count++;
        // Si le compteur atteint 4, le joueur a gagné
        if (count === 4) {
          return true;
        }
      } else {
        // Réinitialiser le compteur si la cellule ne contient pas de jeton du même joueur
        count = 0;
      }
    }
  }

  // Aucun gagnant trouvé, retourner false
  return false;
}

// gameplaySocket.js
const { updateStatistics } = require("../utils/elo.js");

async function handleMove(room, colPlayed, socket, io) {
  const playerIndex = room.players.findIndex(
    (player) => player.socketId === socket.id
  );
  const opponentIndex = room.players.findIndex(
    (player) => player.socketId !== socket.id
  );
  const player = room.players[playerIndex];

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
          await handleGameEnd(room, winner, socket, io);
        }

        return io
          .to(room?.id)
          .emit("move", room.board, playedCell, socket.id, room.players);
      }
    }
  }
}

// Helper function to handle the end of the game
async function handleGameEnd(room, winner, socket, io) {
  const draw = room.cellsPlayed === 42;
  const playerIndex = room.players.findIndex(
    (player) => player.socketId === socket.id
  );
  const opponentIndex = room.players.findIndex(
    (player) => player.socketId !== socket.id
  );
  const player1 = {
    elo: room.players[playerIndex].elo,
    username: room.players[playerIndex].userName,
    id: room.players[playerIndex].id,
  };
  const player2 = {
    elo: room.players[opponentIndex].elo,
    username: room.players[opponentIndex].userName,
    id: room.players[opponentIndex].id,
  };

  if (player1.id && player2.id) {
    if (winner) {
      await updateStatistics(player1, player2, "player1Wins");
    } else if (draw) {
      await updateStatistics(player1, player2, "draw");
    }
  }

  room.players[opponentIndex].turn = false;
  io.to(room?.id).emit("victory", winner ? socket.id : null, draw);
}

// Helper function to handle startGame event
function handleStartGame(room, board, io) {
  room.board = board;
  room.cellsPlayed = 0;
  const firstPlayerIndex = Math.random() < 0.5 ? 0 : 1;
  room.players.forEach((player, index) => {
    player.turn = index === firstPlayerIndex;
  });

  io.to(room?.id).emit("startGame", room.players);
}

module.exports = (
  socket,
  io,
  rooms,
  customRooms,
  findRoomById,
  findCustomRoomById
) => {
  socket.on("move", (colPlayed) => {
    let room =
      findRoomById(socket.id, rooms) ||
      findCustomRoomById(socket.id, customRooms);
    if (room) {
      handleMove(room, colPlayed, socket, io);
    }
  });

  socket.on("play-again", () => {
    const room =
      findRoomById(socket.id, rooms) ||
      findCustomRoomById(socket.id, customRooms);
    if (room) {
      io.to(room?.id).emit("play-again", socket.id);
    }
  });

  socket.on("startGame", (board) => {
    const room =
      findRoomById(socket.id, rooms) ||
      findCustomRoomById(socket.id, customRooms);
    if (room && board) {
      handleStartGame(room, board, io);
    }
  });
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

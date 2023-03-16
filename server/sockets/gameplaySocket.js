// gameplaySocket.js

module.exports = (socket, io, rooms, findRoomById) => {
  socket.on("move", (colPlayed) => {
    let room = findRoomById(socket.id, rooms);
    // let player = room.players.find((player) => player.socketId === socket.id);
    // let opponent = room.players.find((player) => player.socketId !== socket.id);
    let playerIndex = room.players.findIndex(
      (player) => player.socketId === socket.id
    );
    let opponentIndex = room.players.findIndex(
      (player) => player.socketId !== socket.id
    );
    let player = room.players[playerIndex];

    if (room.board && player.turn) {
      for (let i = 0; i < room?.board[colPlayed]?.length; i++) {
        //verif si la case est jouable
        if (room.board[colPlayed][i] === 0) {
          room.board[colPlayed][i] = socket.id;
          console.log(getWinner(colPlayed, i, room.board), player.userName)

          const playedCell = {
            column: Number(colPlayed),
            row: i,
          };

          room.players[playerIndex].turn = false;
          room.players[opponentIndex].turn = true;

          if (getWinner(colPlayed, i, room.board)) {
            room.players[opponentIndex].turn = false;
          }

          return io
            .to(room?.id)
            .emit("move", room.board, playedCell, socket.id, room.players, getWinner(colPlayed, i, room.board));
        }
      }
    }
  });

  socket.on('play-again', () => {
    let room = findRoomById(socket.id, rooms);
    // resetBoard();
    io.to(room?.id).emit('play-again');
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

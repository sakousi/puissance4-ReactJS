// gameplaySocket.js

module.exports = (socket, io, rooms, findRoomById) => {
  socket.on("move", (colPlayed) => {
    let room = findRoomById(socket.id, rooms);
    let player = room.players.find((player) => player.socketId === socket.id);
    let opponent = room.players.find((player) => player.socketId !== socket.id);

    if (room.board && player.turn) {
      for (let i = 0; i < room?.board[colPlayed]?.length; i++) {
        //verif si la case est jouable
        if (room.board[colPlayed][i] === 0) {
          room.board[colPlayed][i] = socket.id;

          const playedCell = {
            column: Number(colPlayed),
            row: i,
          };

          player.turn = false;
          opponent.turn = true;

          return io
            .to(room?.id)
            .emit("move", room.board, playedCell, socket.id, room.players);
        }
      }
    }
  });

  socket.on("checkWin", (data) => {
    // Logic to check if game is won
    // Emit event to notify players of win/loss
  });

  // ... other gameplay events
};

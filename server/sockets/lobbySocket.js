// lobbySocket.js
// const {  findRoomById } = require("./index");

module.exports = (socket, io, rooms, generateId, findRoomById) => {
  socket.on("createRoom", (currentPlayer, board) => {
    player = currentPlayer;
    if (player.roomId) {
      return;
    }
    let roomId;
    let roomPlayer;
    // Vérifie si une room avec un joueur existe
    for (const room of rooms) {
      if (room.players.length === 1) {
        player.roomId = room.id;
        player.color = "bg-yellow-500"
        roomPlayer = room;
        room.players.push(player);
        roomId = room.id;
        break;
      }
    }
    if (!roomId) {
      // Crée une nouvelle room
      console.log("create room");
      roomId = `room-${generateId()}`;
      player.roomId = roomId;
      player.turn = true;
      player.color = "bg-red-500"
      let room = { id: roomId, players: [player], board: board };
      rooms.push(room);
      socket.emit("roomCreated", roomId);
      console.log(`Client ${socket.id} created room ${roomId}`);
    }
    socket.join(roomId);
    socket.emit("roomJoined", roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
    console.log(rooms);

    if (roomPlayer?.players.length === 2) {
      io.to(roomId).emit("startGame", roomPlayer.players);
    }
  });

  socket.on("info", () => {
    let room = findRoomById(socket.id, rooms);
    io.to(room?.id).emit("info", room?.players);
  });
};

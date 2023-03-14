// lobbySocket.js
// const {  findRoomById } = require("./index");

module.exports = (socket, io, rooms, generateId, findRoomById) => {
  socket.on("createRoom", (currentPlayer) => {
    player = currentPlayer;
    if (player.roomId) {
      return;
    }
    let roomId;
    // Vérifie si une room avec un joueur existe
    for (const room of rooms) {
      if (room.players.length === 1) {
        player.roomId = room.id;
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
      let room = { id: roomId, players: [player] };
      rooms.push(room);
      console.log(roomId);
      socket.emit("roomCreated", roomId);
      console.log(`Client ${socket.id} created room ${roomId}`);
    }
    socket.join(roomId);
    socket.emit("roomJoined", roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
    console.log(rooms);
  });

  socket.on("info", () => {
    let room = findRoomById(socket.id, rooms);
    console.log("you", room?.id);
    io.to(room?.id).emit("info", room?.players);
  });
};

// lobbySocket.js
// const {  findRoomById } = require("./index");

module.exports = (socket, io, rooms, customRooms, generateId, findRoomById) => {
  socket.on("createRoom", (currentPlayer, board, type) => {
    player = currentPlayer;
    if (player.roomId) {
      return;
    }
    let roomId;
    let roomPlayer;
    // Vérifie si une room avec un joueur existe
    if (type === "matchmaking") {
      for (const room of rooms) {
        if (room.players.length === 1) {
          player.roomId = room.id;
          player.color = "bg-yellow-500";
          roomPlayer = room;
          room.players.push(player);
          roomId = room.id;
          break;
        }
      }
    }
    if (!roomId) {
      // Crée une nouvelle room
      roomId = `room-${generateId()}`;
      player.roomId = roomId;
      player.turn = true;
      player.color = "bg-red-500";
      let room = {
        id: roomId,
        players: [player],
        board: board,
        cellsPlayed: 0,
      };
      if (type === "matchmaking") {
        rooms.push(room);
      } else {
        customRooms.push(room);
      }
      socket.emit("roomCreated", roomId);
      console.log(`Client ${socket.id} created ${type} room ${roomId}`);
    }
    socket.join(roomId);
    socket.emit("roomJoined", roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
    if (roomPlayer?.players.length === 2) {
      io.to(roomId).emit("startGame", roomPlayer.players);
    }
  });

  socket.on("listCustomRooms", () => {
    io.to(socket.id).emit("listCustomRooms", customRooms);
  });

  socket.on("joinCustomRoom", (player, roomId) => {
    let room = customRooms.find((room) => room.id === roomId);
    if (room && room.players.length === 1) {
      player.roomId = room.id;
      player.color = "bg-yellow-500";
      room.players.push(player);
      socket.join(roomId);
      socket.emit("roomJoined", roomId);
      console.log(`Client ${socket.id} joined custom room ${roomId}`);
      if (room?.players?.length === 2) {
        io.to(room.id).emit("startGame", room.players);
      }
    }
  });

  socket.on("info", () => {
    let room = findRoomById(socket.id, rooms);
    io.to(room?.id).emit("info", room?.players);
  });
};

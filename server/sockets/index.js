// index.js
const gameplaySocket = require("./gameplaySocket");
const lobbySocket = require("./lobbySocket");
const { Server } = require("socket.io");

let rooms = [];
function createSockets(httpServer) {
  console.log("createSockets");
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    // Gameplay events
    gameplaySocket(socket, io, rooms);

    // Lobby events
    lobbySocket(socket, io, rooms, generateId, findRoomById);

    socket.on("disconnect", () => {
      let room = findRoomById(socket.id, rooms);
      if (room) {
        rooms.splice(room, 1);
      }

      console.log(`Client ${socket.id} disconnected`);
    });
  });
}

function findRoomById(playerId, rooms) {
  for (let room of rooms) {
    for (let player of room.players) {
      if (player.socketId === playerId) {
        if (player.roomId) {
          return room;
        }
      }
    }
  }
  return null;
}

function generateId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return `${timestamp}${randomStr}`;
}

module.exports = {
  createSockets,
  generateId,
  findRoomById,
};

// index.js
const gameplaySocket = require("./gameplaySocket");
const lobbySocket = require("./lobbySocket");
const { Server } = require("socket.io");

let rooms = [];
let customRooms = [];
function createSockets(httpServer) {
  console.log("createSockets");
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? "https://julickmellah.fr" : "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    // Gameplay events
    gameplaySocket(socket, io, rooms, customRooms, findRoomById, findCustomRoomById);

    // Lobby events
    lobbySocket(socket, io, rooms, customRooms, generateId, findRoomById, findCustomRoomById);

    socket.on("disconnect", () => {
      let room = findRoomById(socket.id, rooms);
      let customRoom = findCustomRoomById(socket.id, customRooms);
      if (room) {
        if (room.players.length === 1) {
          rooms.splice(rooms.indexOf(room), 1);
        } else {
          let otherPlayer = room.players.find(
            (player) => player.socketId !== socket.id
          );
          if (otherPlayer) {
            io.to(otherPlayer.socketId).emit("opponent-disconnected");
          }
          rooms.splice(rooms.indexOf(room), 1);
        }
      } else if (customRoom) {
        if (customRoom.players.length === 1) {
          customRooms.splice(customRooms.indexOf(customRoom), 1);
        } else {
          let otherPlayer = customRoom.players.find(
            (player) => player.socketId !== socket.id
          );
          if (otherPlayer) {
            io.to(otherPlayer.socketId).emit("opponent-disconnected");
          }
          customRooms.splice(customRooms.indexOf(customRoom), 1);
        }
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

function findCustomRoomById(playerId, customRooms) {
  for (let room of customRooms) {
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

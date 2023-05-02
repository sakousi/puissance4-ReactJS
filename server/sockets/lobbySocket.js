const {
  createLeaderboardData,
} = require("../graphql/Leaderboard/mutations.js");

function handleCreateRoom(
  socket,
  io,
  currentPlayer,
  board,
  type,
  rooms,
  customRooms,
  generateId
) {
  let player = currentPlayer;
  if (player.roomId) {
    return;
  }
  let roomId;
  let roomPlayer;

  if (type === "matchmaking") {
    ({ roomId, roomPlayer } = findOrCreateMatchmakingRoom(player, rooms));
  }

  if (!roomId) {
    ({ roomId, player } = createNewRoom(
      socket,
      type,
      player,
      board,
      rooms,
      customRooms,
      generateId
    ));
  }
  
  socket.join(roomId);
  socket.emit("roomJoined", roomId);
  console.log(`Client ${socket.id} joined room ${roomId}`);

  if (roomPlayer?.players.length === 2) {
    setLeaderboard(roomPlayer);
    io.to(roomId).emit("startGame", roomPlayer.players);
  }
}

function findOrCreateMatchmakingRoom(player, rooms) {
  let roomId;
  let roomPlayer;

  for (const room of rooms) {
    if (room.players.length === 1) {
      if (!room.players[0].id || room.players[0].id !== player.id) {
        player.roomId = room.id;
        player.color = "bg-yellow-500";
        roomPlayer = room;
        room.players.push(player);
        roomId = room.id;
        break;
      } else {
        console.log("meme joueur");
      }
    }
  }
  return { roomId, roomPlayer };
}

function createNewRoom(
  socket,
  type,
  player,
  board,
  rooms,
  customRooms,
  generateId
) {
  const roomId = `room-${generateId()}`;
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

  return { roomId, player };
}

module.exports = (socket, io, rooms, customRooms, generateId, findRoomById) => {
  socket.on("createRoom", (currentPlayer, board, type) => {
    handleCreateRoom(
      socket,
      io,
      currentPlayer,
      board,
      type,
      rooms,
      customRooms,
      generateId
    );
  });

  socket.on("listCustomRooms", () => {
    io.to(socket.id).emit("listCustomRooms", customRooms);
  });

  socket.on("joinCustomRoom", (player, roomId) => {
    const room = customRooms.find((room) => room.id === roomId);

    if (room && room.players.length === 1) {
      player.roomId = room.id;
      player.color = "bg-yellow-500";
      room.players.push(player);
      socket.join(roomId);
      socket.emit("roomJoined", roomId);
      console.log(`Client ${socket.id} joined custom room ${roomId}`);

      if (room.players.length === 2) {
        io.to(room.id).emit("startGame", room.players);
      }
    }
  });

  socket.on("info", () => {
    let room = findRoomById(socket.id, rooms);
    io.to(room?.id).emit("info", room?.players);
  });
};

// créé un leaderboard pour chaque USER de la room qui n'en a pas encore
async function setLeaderboard(room) {
  room.players.forEach((player) => {
    if (player.id) {
      createLeaderboardData({
        id: "",
        player: player.id,
        username: player.userName,
        wins: 0,
        losses: 0,
        draws: 0,
        elo: 1000,
      });
    }
  });
}

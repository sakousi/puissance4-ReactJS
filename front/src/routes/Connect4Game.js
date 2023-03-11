import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AppContext } from "../context/appContext";
import io from "socket.io-client";
import GamePlayersTab from "../components/Connect4Game/GamePlayersTab";
import Board from "../components/Connect4Game/Board";
import socket from "../socket";

export default function Connect4Game() {
  const [roomId, setRoomId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateRoom = () => {
    socket.emit("createRoom");
  };

  const handleJoinRoom = () => {
    socket.emit("joinRoom", roomId);
  };

  socket.on("roomCreated", (data) => {
    setRoomId(data);
  });

  socket.on("roomJoined", (data) => {
    setRoomId(data);
  });

  socket.on("roomNotFound", () => {
    setErrorMessage("Room not found");
  });

  return (
    <>
      <section className="flex flex-col dark:bg-gray-900 min-h-screen">
        <GamePlayersTab></GamePlayersTab>
        <div>
          <button className="text-white" onClick={handleCreateRoom}>Create Room</button>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button className="text-white" onClick={handleJoinRoom}>Join Room</button>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
        <Board></Board>
      </section>
    </>
  );
}

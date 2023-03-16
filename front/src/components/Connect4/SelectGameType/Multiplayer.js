import { useNavigate } from "react-router-dom";
// import socket from "../../../socket";
import { Connect4GameContext } from "../../../context/Connect4GameContext";
import { useContext, useEffect, useRef, useState } from "react";
import { updateCurrentPlayer, createBoard } from "../../../utils/functions";
import Connect4Game from "../../../routes/Connect4Game";

function randomId() {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
}

function generateUsername() {
  return `Player${randomId()}`;
}

export default function Multiplayer() {
  const navigate = useNavigate();
  const gameContext = useContext(Connect4GameContext);
  const { socket, connect } = useContext(Connect4GameContext);
  const [username, setUsername] = useState("");
  const roomId = useRef(null);
  const currentPlayer = useRef(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const isButtonClickedRef = useRef(false);

  const handleSearch = () => {
    console.log("handleSearch");
    isButtonClickedRef.current = true;
    setIsButtonClicked(true);
    if (!socket) {
      connect();
    } else if (socket.connected) {
      currentPlayer.current = {
        userName: username,
        socketId: socket.id,
        roomId: roomId.current,
        turn: false,
        win: false,
        wantRestart: false,
        color: "",
      };
      gameContext.setBoardList(createBoard(7, 6));
      socket?.emit("createRoom", currentPlayer.current, createBoard(7, 6));
    } else {
      socket.connect()
    }
    gameContext.setBoardList(createBoard(7, 6));
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("roomJoined", (data) => {
      roomId.current = data;
      currentPlayer.current = {
        userName: username,
        socketId: socket.id,
        roomId: roomId.current,
        turn: false,
        win: false,
        wantRestart: false,
        color: "",
      };
      gameContext.setCurrentPlayer(currentPlayer.current);
    });

    const handleConnect = () => {
      if (!isButtonClicked) return;
      currentPlayer.current = {
        userName: username,
        socketId: socket.id,
        roomId: roomId.current,
        turn: false,
        win: false,
        wantRestart: false,
        color: "",
      };
      gameContext.setBoardList(createBoard(7, 6));
      socket?.emit("createRoom", currentPlayer.current, createBoard(7, 6));
      isButtonClickedRef.current = false;
      setIsButtonClicked(false);
    };

    socket.on("connect", handleConnect);

    return () => {
      if (socket) {
        socket.off("roomJoined");
        socket.off("connect");
      }
    };
  }, [socket, isButtonClicked]);

  useEffect(() => {
    setUsername(generateUsername());
    if (
      gameContext.currentPlayer &&
      gameContext.currentPlayer.roomId &&
      gameContext.boardList.length > 0
    ) {
      navigate("/connect4/1234");
    }
  }, [gameContext.boardList, roomId, gameContext.currentPlayer, navigate]);

  return (
    <>
      <form className="flex flex-col justify-center items-center my-20">
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Username
          </label>
          <input
            type="username"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          ></input>
        </div>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Search for a game
        </button>
      </form>
    </>
  );
}

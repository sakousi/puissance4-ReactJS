import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/appContext";
import { Connect4GameContext } from "../../../context/Connect4GameContext";
import { createBoard } from "../../../utils/functions";

function randomId() {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
}

function generateUsername() {
  return `Player${randomId()}`;
}

export default function CreateRoom() {
  const appContext = useContext(AppContext);
  const gameContext = useContext(Connect4GameContext);
  const [username, setUsername] = useState("");
  const currentPlayer = useRef(null);
  const roomId = useRef(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const isButtonClickedRef = useRef(false);
  const { socket, connect } = useContext(Connect4GameContext);
  const navigate = useNavigate();

  const createRoom = (e) => {
    setIsButtonClicked(true);
    isButtonClickedRef.current = true;
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
        elo: 1000
      };
      gameContext.setBoardList(createBoard(7, 6));
      socket.emit(
        "createRoom",
        currentPlayer.current,
        createBoard(7, 6),
        "custom"
      );
    } else {
      socket.connect();
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
        elo: 1000
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
        elo: 1000

      };
      gameContext.setBoardList(createBoard(7, 6));
      socket?.emit(
        "createRoom",
        currentPlayer.current,
        createBoard(7, 6),
        "custom"
      );
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
  }, [isButtonClicked, socket]);

  useEffect(() => {
    setUsername(appContext.currentUser?.username || generateUsername());
    if (
      gameContext.currentPlayer &&
      gameContext.currentPlayer.roomId &&
      gameContext.boardList.length > 0
    ) {
      navigate("/connect4/1234");
    }
  }, [
    appContext.currentUser?.username,
    gameContext,
    gameContext.boardList.length,
    gameContext.currentPlayer,
    gameContext.currentUser,
    navigate,
  ]);

  return (
    <div className="fixed bg-slate-600 w-[40rem] h-[30rem] rounded-lg">
      <div className="flex justify-end">
        <button
          type="button"
          className="text-white m-2 bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
          onClick={() => {
            gameContext.setModaleRoomOpen(false);
          }}
        >
          X
        </button>
      </div>
      <form className="flex flex-col justify-center items-center my-20">
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Username
          </label>
          <input
            type="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          ></input>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={(e) => {
            e.preventDefault();
            createRoom();
          }}
        >
          Create Room
        </button>
      </form>
    </div>
  );
}

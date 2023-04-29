import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/appContext";
import { Connect4GameContext } from "../../../context/Connect4GameContext";
import { createBoard } from "../../../utils/functions";
import CreateRoom from "./CreateRoom";
function randomId() {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
}

function generateUsername() {
  return `Player${randomId()}`;
}

export default function JoinRoom() {
  const gameContext = useContext(Connect4GameContext);
  const appContext = useContext(AppContext);
  const { socket, connect } = useContext(Connect4GameContext);
  const [listRooms, setListRooms] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const currentPlayer = useRef(null);
  const modaleOpen = useRef(false);

  const joinCustomRoom = (roomId) => {
    currentPlayer.current = {
      userName: username,
      socketId: socket.id,
      roomId: roomId,
      turn: false,
      win: false,
      wantRestart: false,
      color: "",
      elo: 1000,
    };

    if (currentPlayer.current && socket) {
      gameContext.setCurrentPlayer(currentPlayer.current);
      gameContext.setBoardList(createBoard(7, 6));
      socket?.emit("joinCustomRoom", currentPlayer.current, roomId);
    }
  };

  useEffect(() => {
    const connectSocket = () => {
      if (!socket) {
        connect();
      } else {
        socket.connect();
      }
    };
    connectSocket();

    if (!socket) return;

    socket.emit("listCustomRooms");

    socket.on("listCustomRooms", (data) => {
      setListRooms(data);
    });

    return () => {
      socket?.off("listCustomRooms");
    };
  }, [connect, socket]);

  useEffect(() => {
    return () => {
      //TODO : fix disconnect socket when leave joinRoom
      // if (!modaleOpen.current && !gameContext.modaleRoomOpen) {
      //   socket?.disconnect();
      // }
    };
  }, [gameContext.modaleRoomOpen, socket]);

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
    gameContext.boardList.length,
    gameContext.currentPlayer,
    navigate,
  ]);

  return (
    <>
      <div className="grid grid-rows-4 h-full min-w-full">
        <div className="flex flex-col sm:flex-row min-w-full justify-evenly items-center my-3">
          <form className="flex flex-col justify-center items-center">
            <div className="mb-6">
              <label className="block mb-2 text-xl font-medium text-gray-900 text-white">
                Username
              </label>
              <input
                type="username"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              ></input>
            </div>
          </form>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              modaleOpen.current = true;
              gameContext.setModaleRoomOpen(true);
            }}
            className="text-white h-fit bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
          >
            Create Room
          </button>
        </div>
        {listRooms?.length > 0 ? (
          <div className=" row-span-3 flex flex-col relative min-w-full items-center">
            <div className="flex items-start">
              <h2 className="text-white text-3xl">Rooms</h2>
            </div>
            <button
              onClick={() => socket.emit("listCustomRooms")}
              className="absolute text-white right-[2%] top-[1%] h-fit bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-3 py-1.5 text-center"
            >
              Refresh
            </button>
            <ul className="flex flex-col min-w-full my-3">
              {listRooms
                .filter((room) => room.players?.length === 1)
                .map((room) => (
                  <li
                    key={room.id}
                    className="flex items-center justify-between bg-gray-900 rounded-3xl px-5 py-2.5 my-1.5 mx-3"
                  >
                    <div className="flex flex-row items-center">
                      <p className="text-white">{room.players[0].userName}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        joinCustomRoom(room.id);
                      }}
                      className="text-white h-fit bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-3 py-0.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                    >
                      Rejoindre
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col relative items-center justify-center row-span-3">
            <button
              onClick={() => socket.emit("listCustomRooms")}
              className="absolute text-white right-[10%] top-[10%] h-fit bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-3 py-1.5 text-center"
            >
              Refresh
            </button>
            <p className="text-white text-2xl">No rooms available</p>
          </div>
        )}
      </div>
      {gameContext.modaleRoomOpen && <CreateRoom></CreateRoom>}
    </>
  );
}

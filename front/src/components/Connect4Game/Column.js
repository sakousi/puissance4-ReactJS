import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connect4GameContext } from "../../context/Connect4GameContext";
import socket from "../../socket";

export default function Column(props) {
  const colId = useRef(null);
  const gameContext = useContext(Connect4GameContext);
  const currentPlayer = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [victory, setVictory] = useState(false);
  const [opponentWantsToPlayAgain, setOpponentWantsToPlayAgain] =
    useState(false);
  const opponentWantsRestart = useRef(false);
  const navigate = useNavigate();
  let circles = 6;

  function handleClick(e) {

    if (!currentPlayer.current) {
      currentPlayer.current = gameContext.currentPlayer;
    }

    if (currentPlayer.current.turn) {
      socket.emit("move", props.id);
    }
  }

  useEffect(() => {
    if (!gameContext.currentPlayer) {
      navigate("/connect4");
    }

    socket.on("move", (board, playedCell, socketId, players, victory) => {
      currentPlayer.current = players.find(
        (player) => player.socketId === socket.id
      );
      const opponent = players.find((player) => player.socketId !== socket.id);
      gameContext.setBoardList(board);

      const casePlayed = document.getElementById(
        `${playedCell.column}-${playedCell.row}`
      );

      if (socketId === currentPlayer.current.socketId) {
        casePlayed.classList.add(currentPlayer.current.color);
        casePlayed.classList.remove("dark:bg-gray-900");
        gameContext.setCurrentPlayer(currentPlayer.current);
      } else {
        casePlayed.classList.add(opponent.color);
        casePlayed.classList.remove("dark:bg-gray-900");
        if (opponent) {
          gameContext.setOpponent(opponent);
        }
      }

      if (victory) {
        if (props.id === playedCell.column) {
          colId.current = props.id;
          setIsOpen(!isOpen);
          if (socketId === currentPlayer.current.socketId) {
            setVictory(true);
          }
        }
      }
    });

    socket.on("play-again", () => {
      opponentWantsRestart.current = true;
      setOpponentWantsToPlayAgain(opponentWantsRestart.current);
      if (opponentWantsRestart.current) {
        console.log("reset board");
        resetHtmlBoard();
      }
    });
  }, [gameContext.currentPlayer]);

  function handlePlayAgain() {
    socket.emit("play-again");
    setIsOpen(false);
    opponentWantsRestart.current = false;
    setOpponentWantsToPlayAgain(opponentWantsRestart.current);
  }

  function resetHtmlBoard() {
    const ul = document.getElementById(`row-${props.id}`);
    const lis = ul.querySelectorAll("li");
    lis.forEach((li, i) => {
      li.classList.remove("bg-red-500", "bg-yellow-500");
      li.classList.add("dark:bg-gray-900");
    });
  }

  return (
    <>
      <ul id={`row-${props.id}`} onClick={handleClick} className="">
        {Array(circles)
          .fill()
          .map((_, i) => (
            <li
              key={i}
              id={`${props.id}-${circles - 1 - i}`}
              className="rounded-full m-2 h-14 w-14 dark:bg-gray-900"
            ></li>
          ))}
      </ul>
      {isOpen && (
        <div
          id="popup-modal"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black bg-opacity-50 z-10 flex items-center justify-center"
        >
          <div className="bg-red-500 bg-yellow-500"></div>
          <div className="relative z-20 text-center bg-white rounded-lg shadow dark:bg-gray-700 px-2 py-4">
            <svg
              aria-hidden="true"
              className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>

            <h3 className=" mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {victory ? "VICTORY" : "DEFEAT"}
            </h3>
            <h2 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {opponentWantsToPlayAgain === true
                ? "Your opponent wants to play again"
                : ""}
            </h2>
            <button
              type="button"
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
              onClick={() => {
                handlePlayAgain();
              }}
            >
              Play again
            </button>
            <button
              type="button"
              className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={() => {
                gameContext.setCurrentPlayer(null);
              }}
            >
              Leave Game
            </button>
          </div>
        </div>
      )}
    </>
  );
}

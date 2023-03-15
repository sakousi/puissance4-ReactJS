import { useContext, useEffect, useRef, useState } from "react";
import { Connect4GameContext } from "../../context/Connect4GameContext";
import socket from "../../socket";

export default function Column(props) {
  const gameContext = useContext(Connect4GameContext);
  const currentPlayer = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [victory, setVictory] = useState(false);
  let circles = 6;

  // currentPlayer.current = gameContext.currentPlayer;
  function handleClick(e) {
    if (!currentPlayer.current) {
      currentPlayer.current = gameContext.currentPlayer;
    }

    if (currentPlayer.current.turn) {
      socket.emit("move", props.id);
    }
  }

  useEffect(() => {
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
          setIsOpen(!isOpen);
          if (socketId === currentPlayer.current.socketId) {
            setVictory(true);
          }
        }
      }
    });
  }, []);

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
          onClick={() => {
            setIsOpen(false);
          }}        
        >
          <div className="relative z-20 text-center bg-white rounded-lg shadow dark:bg-gray-700 px-2 py-4">
            <svg
              aria-hidden="true"
              class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 class=" mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {victory ? "VICTORY" : "DEFEAT"}
            </h3>

            <button
              type="button"
              className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Close MODALE
            </button>
          </div>
        </div>
      )}
    </>
  );
}

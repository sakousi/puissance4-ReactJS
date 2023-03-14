import { useContext, useEffect, useRef, useState } from "react";
import { Connect4GameContext } from "../../context/Connect4GameContext";
import socket from "../../socket";

export default function Column(props) {
  const gameContext = useContext(Connect4GameContext);
  const currentPlayer = useRef(null);
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
    socket.on("move", (board, playedCell, socketId, players) => {
      currentPlayer.current = players.find(
        (player) => player.socketId === socket.id
      );

      const opponent = players.find((player) => player.socketId !== socket.id);
      gameContext.setBoardList(board);

      const casePlayed = document.getElementById(
        `${playedCell.column}-${playedCell.row}`
      );

      if (socketId === currentPlayer.current.socketId) {
        casePlayed.classList.add("bg-yellow-500");
        casePlayed.classList.remove("dark:bg-gray-900");
        gameContext.setCurrentPlayer(currentPlayer);
      } else {
        casePlayed.classList.add("bg-red-500");
        casePlayed.classList.remove("dark:bg-gray-900");
        gameContext.setOpponent(opponent);
      }
    });
  }, []);

  return (
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
  );
}

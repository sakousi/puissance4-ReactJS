import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connect4GameContext } from "../../context/Connect4GameContext";
import socket from "../../socket";
import { createBoard } from "../../utils/functions";

function resetHtmlBoard(colId) {
  const ul = document.getElementById(`row-${colId}`);
  const lis = ul.querySelectorAll("li");
  lis.forEach((li) => {
    li.classList.remove("bg-red-500", "bg-yellow-500");
    li.classList.add("dark:bg-gray-900");
  });
}

export default function Column(props) {
  const gameContext = useContext(Connect4GameContext);
  const currentPlayer = useRef(null);
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
    });

    socket.on("startGame", (players) => {
      players.forEach((player) => {
        if (player.socketId === socket.id) {
          currentPlayer.current = player;
          gameContext.setCurrentPlayer(player);
        } else {
          if (player) {
            gameContext.setOpponent(player);
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!gameContext.currentPlayer) {
      navigate("/connect4");
    }

    if (props.resetRequested) {
      resetHtmlBoard(props.id);
    }
  }, [
    gameContext,
    gameContext.currentPlayer,
    navigate,
    props.id,
    props.resetRequested,
  ]);

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
    </>
  );
}

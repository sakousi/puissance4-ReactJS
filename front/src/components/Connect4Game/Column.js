import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connect4GameContext } from "../../context/Connect4GameContext";
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
  const { socket, connect } = useContext(Connect4GameContext);
  let circles = 6;
  const navigate = useNavigate();
  const colHovered = useRef(false);
  const lastClicableCell = useRef(null);
  const currentBoard = useRef(null);

  function handleClick(e) {
    if (!currentPlayer.current) {
      currentPlayer.current = gameContext.currentPlayer;
    }

    if (currentPlayer.current.turn) {
      socket.emit("move", props.id);
    }
  }

  useEffect(() => {
    if (!socket) return;

    socket.on("move", (board, playedCell, socketId, players) => {
      currentPlayer.current = players.find(
        (player) => player.socketId === socket.id
      );
      const opponent = players.find((player) => player.socketId !== socket.id);
      const casePlayed = document.getElementById(
        `${playedCell.column}-${playedCell.row}`
      );
      gameContext.setBoardList(board);
      currentBoard.current = board;

      if (socketId === currentPlayer.current.socketId) {
        casePlayed.classList.add(currentPlayer.current.color);
        casePlayed.classList.remove("bg-gray-900");
      } else {
        casePlayed.classList.add(opponent.color);
        casePlayed.classList.remove("bg-gray-900");
      }
    });

    socket.on("startGame", (players) => {
      currentBoard.current = createBoard(7, 6);
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

  const handleMouseEnter = useCallback((e) => {
    if (currentPlayer.current?.turn && !colHovered.current) {
      for (let i = 0; i < circles; i++) {
        if (currentBoard.current[props.id][i] === 0) {
          lastClicableCell.current = document.getElementById(
            `${props.id}-${i}`
          );
          lastClicableCell.current?.classList?.remove("bg-gray-900");
          lastClicableCell.current?.classList?.add(currentPlayer.current.color);
          colHovered.current = true;
          break;
        }
      }
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (
      lastClicableCell.current &&
      lastClicableCell.current.id &&
      currentBoard.current[props.id][
        lastClicableCell?.current?.id?.split("-")[1]
      ] === 0
    ) {
      lastClicableCell.current?.classList.add("bg-gray-900");
      lastClicableCell.current?.classList.remove(currentPlayer.current.color);
    }
    colHovered.current = false;
  }, []);

  return (
    <>
      <ul
        id={`row-${props.id}`}
        onClick={handleClick}
        className={`${currentPlayer.current?.turn && "hover:bg-gray-500"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {Array(circles)
          .fill()
          .map((_, i) => (
            <li
              key={i}
              id={`${props.id}-${circles - 1 - i}`}
              className="rounded-full min-[100px]:m-1 min-[100px]:h-8 min-[100px]:w-8 min-[375px]:h-10 min-[375px]:w-10 m-2 min-[500px]:h-20 min-[500px]:w-20 bg-gray-900"
            ></li>
          ))}
      </ul>
    </>
  );
}

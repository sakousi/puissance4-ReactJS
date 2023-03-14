import { useContext, useEffect, useRef, useState } from "react";
import { Connect4GameContext } from "../../context/Connect4GameContext";
import socket from "../../socket";

export default function Column(id) {
  const gameContext = useContext(Connect4GameContext);
  const [boardList, setBoardList] = useState(gameContext.boardList);
  const [highestChanged, setHighestChanged] = useState(-1);

  let circles = 6;

  function handleClick(e) {
    const [rowId, colId] = e.target.id.split("-");

    // Change color of top-most circle in column
    const topLi = document.getElementById(`${id.id}-${circles - 1}`);
    if (topLi && !topLi.classList.contains("bg-red-500")) {
      topLi.classList.add("bg-red-500");
      topLi.classList.remove("dark:bg-gray-900");

      const player = gameContext.currentPlayer;
      const data = {
        player,
        column: colId,
      };
      socket.emit("move", data);
    }
  }

  return (
    <ul id={`row-${id.id}`} onClick={handleClick} className="">
      {Array(circles)
        .fill()
        .map((_, i) => (
          <li
            key={i}
            id={`${id.id}-${circles - 1 - i}`}
            className="rounded-full m-2 h-14 w-14 dark:bg-gray-900"
          ></li>
        ))}
    </ul>
  );
}

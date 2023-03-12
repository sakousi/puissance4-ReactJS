import { useContext, useEffect, useRef, useState } from "react";
import { Connect4GameContext } from "../../context/Connect4GameContext";
import socket from "../../socket";

export default function Column(id) {
  const gameContext = useContext(Connect4GameContext);
  const [boardList, setBoardList] = useState(gameContext.boardList);

  
  function ebe() {
    const newBoardList = ['a', 'b', 'c'];
    setBoardList(newBoardList);
    gameContext.setBoardList(newBoardList);
    console.log(gameContext.boardList);
  }

  let circles = 6;



  return (
    <ul id={`row-${id.id}`} onClick={ebe} className="">
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

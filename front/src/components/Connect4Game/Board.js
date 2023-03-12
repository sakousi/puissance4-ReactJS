import Column from "./Column";
import { Connect4GameContext } from "../../context/Connect4GameContext";
import { useContext, useEffect, useState } from "react";

export default function Board() {
  const gameContext = useContext(Connect4GameContext);
  const [boardList, setBoardList] = useState(gameContext.boardList);
  console.log(gameContext.boardList)
  useEffect(() => {
    setBoardList(gameContext.boardList);

  }, [boardList, gameContext.boardList]);

  return (
    <section className="flex items-center justify-center dark:bg-gray-900">
      <button onClick={() => {
        console.log(gameContext.boardList)
      }} className="text-white">
        bonjour
      </button>
      <div className="flex my-14 rounded-lg dark:bg-gray-600">
        {boardList.length > 0
          ? Array(boardList.length)
              .fill()
              .map((_, i) => <Column key={i} id={i}></Column>)
          : ""}
      </div>
    </section>
  );
}

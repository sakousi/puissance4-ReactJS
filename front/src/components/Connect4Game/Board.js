import Column from "./Column";
import { Connect4GameContext } from "../../context/Connect4GameContext";
import { useContext, useEffect, useRef, useState } from "react";

export default function Board() {
  const gameContext = useContext(Connect4GameContext);
  const [boardList, setBoardList] = useState(gameContext.boardList);
  const [currentPlayer, setCurrentPlayer] = useState(gameContext.currentPlayer)


  useEffect(() => {
    setBoardList(gameContext.boardList);

    if (gameContext.currentPlayer) {
      console.log(gameContext.currentPlayer)
    }

    setCurrentPlayer(gameContext.currentPlayer);
  }, [boardList, gameContext.boardList, gameContext.currentPlayer]);


  return (
    <section className="flex items-center justify-center dark:bg-gray-900">
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

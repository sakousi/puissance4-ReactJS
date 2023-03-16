import GamePlayersTab from "../components/Connect4Game/GamePlayersTab";
import Board from "../components/Connect4Game/Board";
import { useContext, useEffect, useRef } from "react";
import { Connect4GameContext } from "../context/Connect4GameContext";

export default function Connect4Game() {
  const gameContext = useContext(Connect4GameContext);
  const { socket, connect } = useContext(Connect4GameContext);

  const opponent = useRef(null);

  useEffect(() => {
    connect();

    if (!socket) return;

    socket.emit("info");

    socket.on("info", (data) => {
      opponent.current = data.find((player) => player.socketId !== socket.id);
      if (opponent.current) {
        gameContext.setOpponent(opponent.current);
      }
    });
  }, []);

  return (
    <section className="flex flex-col dark:bg-gray-900 min-h-screen">
      <GamePlayersTab></GamePlayersTab>
      <Board></Board>
    </section>
  );
}

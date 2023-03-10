import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AppContext } from "../context/appContext";
import io from "socket.io-client";
import GamePlayersTab from "../components/Connect4Game/GamePlayersTab";
import Board from "../components/Connect4Game/Board";

export default function Connect4Game() {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <>
      <section className="flex flex-col dark:bg-gray-900 min-h-screen">
          <GamePlayersTab></GamePlayersTab>
          
          <Board></Board>
      </section>
    </>
  );
}
   
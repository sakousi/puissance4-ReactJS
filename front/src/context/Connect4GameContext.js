import { Children, createContext, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AppContext } from "./appContext";
import io from "socket.io-client";
import GamePlayersTab from "../components/Connect4Game/GamePlayersTab";
import Board from "../components/Connect4Game/Board";
import socket from "../socket";
import Connect4Game from "../routes/Connect4Game";
import Connect4 from "../routes/Connect4Manage";

export const Connect4GameContext = createContext(null);

export default function Connect4GameProvider({ children }) {
  const [boardList, setBoardList] = useState([]);


  return (
    <Connect4GameContext.Provider value={{ boardList, setBoardList }}>
      {children}
    </Connect4GameContext.Provider>
  );
}

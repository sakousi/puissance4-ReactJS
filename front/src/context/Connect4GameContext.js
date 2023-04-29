import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";

export const Connect4GameContext = createContext(null);

export default function Connect4GameProvider({ children }) {
  const [boardList, setBoardList] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [modaleRoomOpen, setModaleRoomOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  const backendUrl = process.env.NODE_ENV === "production" ? "https://julickmellah.fr:3101" : "http://localhost:3101";

  const connect = () => {
    if (!connected) {
      const newSocket = io.connect(backendUrl);
      setSocket(newSocket);
      setConnected(true);
    }
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <Connect4GameContext.Provider
      value={{
        boardList,
        setBoardList,
        currentPlayer,
        setCurrentPlayer,
        opponent,
        setOpponent,
        socket,
        connect,
        modaleRoomOpen,
        setModaleRoomOpen,
      }}
    >
      {children}
    </Connect4GameContext.Provider>
  );
}

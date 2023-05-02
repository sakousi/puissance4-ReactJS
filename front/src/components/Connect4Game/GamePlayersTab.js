import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Connect4GameContext } from "../../context/Connect4GameContext";
import { useNavigate } from "react-router-dom";

export default function GamePlayersTab() {
  const gameContext = useContext(Connect4GameContext);
  const currentPlayer = gameContext.currentPlayer;
  // const opponent = gameContext.opponent;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { socket, connect } = useContext(Connect4GameContext);
  const [opponent, setOpponent] = useState(null);
  const [waitingSeconds, setWaitingSeconds] = useState(0);

  useEffect(() => {
    if (!gameContext.currentPlayer && !socket?.connected) {
      gameContext.setOpponent(null);
      navigate("/connect4");
    }

    if (gameContext.opponent) {
      setOpponent(gameContext.opponent);
    }
  }, [gameContext, gameContext.currentPlayer, navigate, socket]);

  useEffect(() => {
    if (!opponent) {
      const intervalId = setInterval(() => {
        setWaitingSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [opponent]);

  return (
    <>
      <nav className=" border-gray-200 px-2 sm:px-4 py-2.5 bg-gray-900">
        <div className="grid grid-cols-3">
          {opponent ? (
            <ul className="lg:col-start-2 grid col-span-2 lg:col-span-1 grid-cols-2 p-4 border">
              <li className="flex flex-row items-center justify-center mx-3 lg:mx-8">
                <p className="text-white text-2xl text-center">
                  {currentPlayer?.userName ? currentPlayer.userName : ""}
                </p>
                <div
                  className={`${gameContext?.currentPlayer?.color} m-2 h-16 w-16 rounded-full`}
                ></div>
              </li>
              <li className="flex flex-row items-center justify-center mx-3 lg:mx-8">
                <div
                  className={`${gameContext?.opponent?.color} m-2 h-16 w-16 rounded-full`}
                ></div>
                <p className="text-white text-2xl text-center">
                  {opponent?.userName ? opponent.userName : ""}
                </p>
              </li>
            </ul>
          ) : (
            <div className="grid col-span-2 p-4 border text-base sm:text-lg font-semibold text-white">
              Waiting for opponent: {waitingSeconds} seconds
            </div>
          )}

          <div className="flex items-center  justify-end">
            <div>
              <ul
                className="flex flex-row py-2"
                aria-labelledby="user-menu-button"
              >
                <li className="mx-8">
                  <Link
                    onClick={() => {
                      setIsOpen(!isOpen);
                    }}
                    className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                  >
                    Leave Game
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {isOpen && (
        <div
          id="popup-modal"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center"
        >
          <div className="relative text-center  rounded-lg shadow bg-gray-700 px-2 py-4">
            <svg
              aria-hidden="true"
              className="mx-auto mb-4 text-gray-400 w-14 h-14 text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className=" mb-5 text-xl font-normal text-gray-500 text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <button
              type="button"
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 focus:ring-red-800 font-medium rounded-lg text-lg inline-flex items-center px-5 py-2.5 text-center mr-2"
              onClick={() => {
                gameContext.setCurrentPlayer(null);
                socket.disconnect();
              }}
            >
              Yes, I'm sure
            </button>
            <button
              type="button"
              className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              Close MODALE
            </button>
          </div>
        </div>
      )}
    </>
  );
}

import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Connect4GameContext } from "../../context/Connect4GameContext";
import { useNavigate } from "react-router-dom";

export default function GamePlayersTab() {
  const gameContext = useContext(Connect4GameContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { socket, connect } = useContext(Connect4GameContext);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [waitingSeconds, setWaitingSeconds] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!gameContext.currentPlayer && !socket?.connected) {
      gameContext.setOpponent(null);
      navigate("/connect4");
    }

    if (gameContext.currentPlayer) {
      setCurrentPlayer(gameContext.currentPlayer);
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

  useEffect(() => {
    if (!currentPlayer || !opponent) return;

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => {
      setTimer(0);
      clearInterval(intervalId);
    };
  }, [currentPlayer, currentPlayer?.turn, opponent, opponent?.turn]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <>
      <nav className=" border-gray-200 px-2 sm:px-4 py-2.5 bg-gray-900">
        <div className="flex flex-row items-center justify-center relative">
          {opponent ? (
            <ul className="flex flex-row p-4 border">
              <li className="flex flex-row items-center justify-center mx-3 lg:mx-8">
                <div className="flex items-end flex-col">
                  <p className="text-white text-base min-[450px]:text-lg sm:text-2xl text-center">
                    {currentPlayer?.userName ? currentPlayer.userName : ""}
                  </p>
                  <p
                    className={`text-white text-[12px] min-[450px]:text-[14px] sm:text-md ${
                      currentPlayer?.turn ? "bg-green-600" : "bg-gray-800"
                    } p-1.5 w-min`}
                  >
                    {currentPlayer?.turn ? formatTime(timer) : "00:00"}
                  </p>
                </div>
                <div
                  className={`${currentPlayer?.color} m-2 h-10 min-[450px]:h-12 sm:h-16 w-10 min-[450px]:w-12 sm:w-16 rounded-full`}
                ></div>
              </li>
              <li className="flex flex-row items-center justify-center mx-3 lg:mx-8">
                <div
                  className={`${opponent?.color} m-2 h-10 min-[450px]:h-12 sm:h-16 w-10 min-[450px]:w-12 sm:w-16 rounded-full`}
                ></div>
                <div className="flex items-start flex-col">
                  <p className="text-white text-base min-[450px]:text-lg sm:text-2xl text-center">
                    {opponent?.userName ? opponent.userName : ""}
                  </p>
                  <p
                    className={`text-white text-[12px] min-[450px]:text-[14px] sm:text-md ${
                      opponent?.turn ? "bg-green-600" : "bg-gray-800"
                    } p-1.5 w-min`}
                  >
                    {opponent?.turn ? formatTime(timer) : "00:00"}
                  </p>
                </div>
              </li>
            </ul>
          ) : (
            <div className="grid col-span-2 p-4 border text-base sm:text-lg font-semibold text-white">
              Waiting for opponent: {waitingSeconds} seconds
            </div>
          )}
          <button
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="absolute top-0 right-0 bg-red-700 hover:bg-red-800 text-white rounded-full font-bold w-8 h-8 flex items-center justify-center "
          >
            <svg
              className="w-5 h-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"
              ></path>
            </svg>
          </button>
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

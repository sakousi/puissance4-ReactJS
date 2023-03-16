import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Connect4GameContext } from "../../context/Connect4GameContext";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";

export default function GamePlayersTab() {
  const gameContext = useContext(Connect4GameContext);
  const currentPlayer = gameContext.currentPlayer;
  const opponent = gameContext.opponent;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameContext.currentPlayer) {
      navigate("/connect4");
    }
  }, [gameContext.currentPlayer]);

  return (
    <>
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 dark:bg-gray-900">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <div></div>
          <div className="flex items-center md:order-2">
            <div>
              <ul
                className="flex flex-col py-2 md:flex-row"
                aria-labelledby="user-menu-button"
              >
                <li>
                  <Link
                    onClick={() => {
                      setIsOpen(!isOpen);
                    }}
                    className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Leave Game
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <p className="text-white">
                  {currentPlayer?.userName ? currentPlayer.userName : ""}
                </p>
              </li>
              <li>
                <p className="text-white">
                  {opponent?.userName ? opponent.userName : ""}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {isOpen && (
        <div
          id="popup-modal"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center"
        >
          <div className="relative text-center bg-white rounded-lg shadow dark:bg-gray-700 px-2 py-4">
            <svg
              aria-hidden="true"
              className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className=" mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <button
              type="button"
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
              onClick={() => {
                gameContext.setCurrentPlayer(null);
                socket.disconnect();
              }}
            >
              Yes, I'm sure
            </button>
            <button
              type="button"
              className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
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

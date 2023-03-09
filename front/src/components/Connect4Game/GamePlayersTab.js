import { Link } from "react-router-dom";

export default function GamePlayersTab() {
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
                    to={"/connect4"}
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
                <p className="text-white">Player1</p>
              </li>
              <li>
                <p className="text-white">Player2</p>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

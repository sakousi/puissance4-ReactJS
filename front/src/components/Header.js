import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { useApolloClient } from "@apollo/client";

export default function Header() {
  const appContext = useContext(AppContext);
  const client = useApolloClient();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    appContext.setLoggedIn(false);
    localStorage.removeItem("token");
    window.location.reload();
    client.resetStore();
    console.log("on espere que ca marche cette fois");
  };

  const handleClickOutside = (event) => {
    if (showMenu && !event.target.closest("#dropdownmenu")) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
  }, [showMenu]);

  return (
    <nav className=" border-gray-200 px-2 sm:px-4 py-2.5 bg-gray-900 relative">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link to={"/"} className="flex items-center ">
          <img
            src={`${process.env.PUBLIC_URL}/images/Puissance_4.svg`}
            className="h-12 w-12 sm:h-14 sm:w-14 mx-4 rounded-lg"
            alt="dauphin Logo"
          />
          <span className="self-center hidden sm:contents text-3xl font-semibold whitespace-nowrap text-white">
            MellahGames
          </span>
        </Link>
        <div className="flex items-center md:order-2">
          <div>
            <ul
              className="flex flex-col py-2 md:flex-row mr-2 sm:mr-0"
              aria-labelledby="user-menu-button"
            >
              {appContext.loggedIn ? (
                <>
                  <li
                    id="dropdownmenu"
                    className="flex items-center flex-col relative"
                  >
                    <button
                      className="flex items-center text-lg font-medium rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:mr-0 focus:ring-4 focus:ring-gray-700 text-white"
                      type="button"
                      onClick={() => setShowMenu(!showMenu)}
                    >
                      <img
                        className="w-8 h-8 mr-2 rounded-full"
                        src={process.env.PUBLIC_URL + "/images/userconnect.png"}
                        alt="user"
                      />
                      {appContext?.currentUser?.username}
                      <svg
                        className="w-4 h-4 mx-1.5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                      </svg>
                    </button>
                    <div
                      className={`absolute z-10 divide-y rounded-lg shadow w-36 bg-gray-700 divide-gray-600 top-[130%] ${
                        showMenu ? "" : "hidden"
                      }`}
                    >
                      <ul className=" text-lg text-gray-700 dark:text-gray-200">
                        <li>
                          <Link to={'/statistics'} className="block px-4 py-2 hover:bg-gray-600 hover:text-white">
                            Statistics
                          </Link>
                        </li>
                        <li>
                          <Link to={'/settings'} className="block px-4 py-2 hover:bg-gray-600 hover:text-white">
                            Settings
                          </Link>
                        </li>
                        <li>
                          <Link
                            onClick={() => handleLogout()}
                            className="block px-4 py-2 hover:bg-gray-600 text-gray-200 hover:text-white"
                          >
                            Sign out
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to={"/login"}
                      className="block px-4 py-2 text-xl text-gray-700 text-white hover:bg-gray-100 hover:bg-gray-600 text-gray-200 hover:text-white"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/register"}
                      className="block px-4 py-2 text-xl text-gray-700 text-white hover:bg-gray-100 hover:bg-gray-600 text-gray-200 hover:text-white"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 absolute top-2.5 left-1/2 transform -translate-x-1/2"
          id="mobile-menu-2"
        >
          <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700">
            <li>
              <Link
                to="/"
                className="block py-2 pl-3 pr-4 text-lg text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 text-gray-400 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/connect4"
                className="block py-2 pl-3 pr-4 text-lg text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 text-gray-400 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700"
              >
                Connect4
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
// {/* <button
//                   onClick={handleLogout}
//                   className="block px-4 py-2 text-xl text-white hover:bg-gray-100 hover:bg-gray-600 text-gray-200 hover:text-white"
//                 >
//                   Disconned
//                 </button> */}

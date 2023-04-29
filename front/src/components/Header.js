import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { useApolloClient } from "@apollo/client";

export default function Header() {
  const appContext = useContext(AppContext);
  const client = useApolloClient();

  const handleLogout = () => {
    appContext.setLoggedIn(false);
    localStorage.removeItem("token");
    window.location.reload();
    client.resetStore();
  };

  return (
    <nav className=" border-gray-200 px-2 sm:px-4 py-2.5 bg-gray-900 relative">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link to={"/"} className="flex items-center ">
          <img
            src={`${process.env.PUBLIC_URL}/images/dauphin.jpg`}
            className="h-12 w-12 sm:h-16 sm:w-16 mx-4 rounded-full"
            alt="dauphin Logo"
          />
          <span className="self-center text-3xl font-semibold whitespace-nowrap text-white">
            MellahGames
          </span>
        </Link>
        <div className="flex items-center md:order-2">
          <div>
            <ul
              className="flex flex-col py-2 md:flex-row"
              aria-labelledby="user-menu-button"
            >
              {appContext.loggedIn ? (
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-xl text-gray-700 hover:bg-gray-100 hover:bg-gray-600 text-gray-200 hover:text-white"
                >
                  Disconned
                </button>
              ) : (
                <>
                  <li>
                    <Link
                      to={"/login"}
                      className="block px-4 py-2 text-xl text-gray-700 hover:bg-gray-100 hover:bg-gray-600 text-gray-200 hover:text-white"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/register"}
                      className="block px-4 py-2 text-xl text-gray-700 hover:bg-gray-100 hover:bg-gray-600 text-gray-200 hover:text-white"
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

import { useLazyQuery } from "@apollo/client";
import { createContext, useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
} from "react-router-dom";
import { GET_CURRENT_USER } from "../API/userRequest";
import App from "../App";
import Connect4Manage from "../routes/Connect4Manage";
import Connect4Game from "../routes/Connect4Game";
import Login from "../routes/Login";
import Register from "../routes/Register";
import Connect4GameProvider from "./Connect4GameContext";
export const AppContext = createContext(null);

export function AppProvider() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const token = localStorage.getItem("token");

  const [getUserById] = useLazyQuery(GET_CURRENT_USER, {
    onCompleted(data) {
      setCurrentUser(data.getUserById);
      setLoggedIn(true);
    },
  });

  useEffect(() => {
    if (token) {
      getUserById();
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/connect4/*",
      element: (
        <Connect4GameProvider>
          <Connect4Routes />
        </Connect4GameProvider>
      ),
    },
  ]);

  function Connect4Routes() {
    return (
      <Routes>
        <Route path="/" element={<Connect4Manage />} />
        <Route path=":id" element={<Connect4Game />} />
      </Routes>
    );
  }

  return (
    <AppContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        currentUser,
        setCurrentUser,
      }}
    >
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}

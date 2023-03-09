import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { createContext, useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GET_CURRENT_USER, GET_USER_BY_ID, LOGIN } from "../API/userRequest";
import App from "../App";
import Connect4 from "../routes/Connect4";
import Connect4Game from "../routes/Connect4Game";
import Login from "../routes/Login";
import Register from "../routes/Register";

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
  })

  useEffect(() => {
    if (token) {
      getUserById({})
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
      path: "/connect4",
      element: <Connect4 />,
    },
    {
      path: "/connect4/:id",
      element: <Connect4Game />,
    }
  ]);

  return (
    <AppContext.Provider value={{ loggedIn, setLoggedIn }}>
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}

import { useMutation } from "@apollo/client";
import { createContext, useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LOGIN } from "../API/userRequest";
import App from "../App";
import Login from "../routes/Login";
import Register from "../routes/Register";
// import About from '../routes/About';

export const AppContext = createContext(null);

export function AppProvider() {
  const [loggedIn, setLoggedIn] = useState(false);
  // const [currentUser, setCurrentUser] = useState(null);


  const getEmail = localStorage.getItem("email");
  const getPassword = localStorage.getItem("password");

  const [login, { data: loginData }] = useMutation(LOGIN, {
    onCompleted() {
      setLoggedIn(true);
    },
  });

  useEffect(() => {
    if (getEmail && getPassword) {
      console.log("useEffect");
      login({
        variables: {
          email: getEmail,
          password: getPassword,
        },
      });
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
      element: loggedIn ? <App /> : <Login />,
    },
  ]);

  return (
    <AppContext.Provider value={{ loggedIn, setLoggedIn }}>
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}

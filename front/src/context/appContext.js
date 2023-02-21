import { createContext, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import Login from '../routes/Login';
import Register from '../routes/Register';
// import About from '../routes/About';

export const AppContext = createContext(null)

export function AppProvider() {
  const [loggedIn, setLoggedIn] = useState(true)

  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
      path: '/',
      element: loggedIn ? (<App />) : (<Login />)
      
    },
  ])

  return (
    <AppContext.Provider value={{loggedIn, setLoggedIn}}>
      <RouterProvider router={router} />
    </AppContext.Provider>
  )
}
import "./reset.css";
import "./App.css";
import "./index.css";
import io from "socket.io-client";
import { UPDATE_USER } from "./API/userRequest";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import Header from "./components/Header";

const socket = io.connect("http://localhost:3101");

export default function App() {
  const [userInput, setUserInput] = useState("");
  const [updateUser] = useMutation(UPDATE_USER);

  return (
    <>
      <Header></Header>
      <div className="dark:bg-gray-900 h-screen">
        <h2 className="text-white">My first Apollo app 🚀</h2>
        <form className="formInput">
          <input className="input" placeholder="What needs to be done?" />
          <i className="inputMarker fa fa-angle-right" />
        </form>
      </div>
    </>
  );
}

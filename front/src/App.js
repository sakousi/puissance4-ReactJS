import "./reset.css";
import "./App.css";
import "./index.css";
import io from "socket.io-client";
import { UPDATE_USER } from "./API/userRequest";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import Header from "./components/Header";
import GameOne from "./components/Home/GameOne";

const socket = io.connect("http://localhost:3101");

export default function App() {
  return (
    <>
      <Header></Header>
      <section className="flex flex-col dark:bg-gray-900 h-screen">
        <h1 className="text-white text-4xl text-center">Games</h1>
        <div className="grid grid-cols-3 mx-14 my-8 gap-8">
          <GameOne></GameOne>
        </div>
      </section>
    </>
  );
}

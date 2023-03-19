import { useContext, useState } from "react";
import { Connect4GameContext } from "../../../context/Connect4GameContext";
import CreateRoom from "./CreateRoom";

export default function JoinRoom() {
  const gameContext = useContext(Connect4GameContext);

  return (
    <>
      <div className="grid grid-rows-4 h-full min-w-full">
        <div className="flex flex-row min-w-full justify-evenly items-center my-3">
          <form className="flex flex-col justify-center items-center">
            <div className="mb-6">
              <label className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">
                Username
              </label>
              <input
                type="username"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Username"
                required
              ></input>
            </div>
          </form>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              console.log("Create Room");
              gameContext.setModaleRoomOpen(true);
            }}
            className="text-white h-fit bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create Room
          </button>
        </div>
        <div className=" row-span-3 flex min-w-full items-center justify-center">
          <div className="flex items-start">
            <h2 className="text-white text-3xl">Rooms</h2>
          </div>
          <div></div>
        </div>
      </div>
      {gameContext.modaleRoomOpen && <CreateRoom></CreateRoom>}
    </>
  );
}

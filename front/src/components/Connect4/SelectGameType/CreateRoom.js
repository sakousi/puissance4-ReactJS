import { useContext } from "react";
import { Connect4GameContext } from "../../../context/Connect4GameContext";

export default function CreateRoom() {
  const gameContext = useContext(Connect4GameContext);

  return (
    <div className="fixed bg-slate-600 w-[40rem] h-[30rem] rounded-lg">
      <div className="flex justify-end">
        <button
          type="button"
          className="text-white m-2 bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
          onClick={() => {
            gameContext.setModaleRoomOpen(false);
          }}
        >
          X
        </button>
      </div>
      <form className="flex flex-col justify-center items-center my-20">
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Username
          </label>
          <input
            type="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Username"
            required
          ></input>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create Room
        </button>
      </form>
    </div>
  );
}

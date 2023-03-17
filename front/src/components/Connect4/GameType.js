import { useState } from "react";
import CreateRoom from "./SelectGameType/CreateRoom";
import JoinRoom from "./SelectGameType/JoinRoom";
import Multiplayer from "./SelectGameType/Multiplayer";

export default function GameType() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const buttonStyleClicked = "text-white text-xl";

  const baseStyle =
    "inline-block w-full p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600";

  return (
    <div className="grid row-start-1 lg:col-start-2 lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 min-w-full">
      <div className="flex flex-col">
        <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex dark:divide-gray-600 dark:text-gray-400">
          {["Multiplayer", "Join Room", "Create Room"].map((item, index) => {
            return (
              <li key={index} className="w-full">
                <button
                  className={`${baseStyle} ${
                    index === 0 ? "rounded-tl-lg" : ""
                  } ${index === 2 ? "rounded-tr-lg" : ""} + ${index === activeTab ? buttonStyleClicked : ""}}`}
                  onClick={() => handleTabClick(index)}
                >
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex h-auto justify-center items-center">
        {activeTab === 0 ? (
          <Multiplayer></Multiplayer>
        ) : activeTab === 1 ? (
          <JoinRoom></JoinRoom>
        ) : activeTab === 2 ? (
          <CreateRoom></CreateRoom>
        ) : null}

      </div>
    </div>
  );
}

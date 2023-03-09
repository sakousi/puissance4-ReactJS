import { useState } from "react";

export default function GameType() {
  const [activeTab, setActiveTab] = useState(0);

  function handleTabClick() {
    console.log("you");
    // setActiveTab(index);
  }

  return (
    <div className="col-span-2 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 min-w-full">
      <div className="flex flex-col">
        <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex dark:divide-gray-600 dark:text-gray-400">
          {["Multiplayer", "Join Room", "Create Room"].map((item, index) => {
            return (
              <li key={index} className="w-full">
                <button
                  className="inline-block w-full p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600"
                  onSubmit={handleTabClick()}
                >
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

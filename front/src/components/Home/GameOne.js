import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function GameOne() {
  return (
    <div className="max-w-sm  border border-gray-200 rounded-lg shadow bg-gray-800 border-gray-700">
      <Link to='/connect4'>
        <img
          className="rounded-t-lg"
          src={process.env.PUBLIC_URL + "/images/gamePlay.png"}
          alt=""
        />
      </Link>
      <div className="p-5">
        <Link to='/connect4'>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-white">
            Connect 4
          </h5>
        </Link>
        <p className="mb-3 font-normal text-gray-700 text-gray-400">
          Connect four of your colored discs in a row to win in the game of
          Connect Four.
        </p>
        <Link
          to='/connect4'
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
        >
          Play
          <svg
            aria-hidden="true"
            className="w-4 h-4 ml-2 -mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}

import { useLazyQuery, useQuery } from "@apollo/client";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { GET_ALL_LEADERBOARDS } from "../../API/userRequest";
import { AppContext } from "../../context/appContext";

export default function Leaderboard() {
  const appContext = useContext(AppContext);

  const { data, loading, error } = useQuery(GET_ALL_LEADERBOARDS);

  return (
    <>
      {appContext?.currentUser ? (
        <div className="col-span-1 min-w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="overflow-auto max-h-96">
            <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <div className="grid grid-cols-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                <div className="px-6 font-extrabold text-white text-[14px] my-4">
                  Username
                </div>
                <div className="font-extrabold text-white text-[14px] my-4 text-center">
                  Score
                </div>
              </div>
              <div className="grid grid-cols-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                <div className="col-start-2 flex flex-row justify-center text-sm">
                  <div
                    title="wins"
                    className="text-green-600 font-extrabold px-1.5 dark:text-green-400"
                  >
                    v
                  </div>
                  <div
                    title="draws"
                    className="text-orange-500 font-extrabold px-1.5 dark:text-orange-400"
                  >
                    d
                  </div>
                  <div
                    title="losses"
                    className="text-red-600 font-extrabold px-1.5 dark:text-red-500"
                  >
                    l
                  </div>
                </div>
              </div>

              <div className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {data?.getAllLeaderboards?.map((leaderboard) => {
                  return (
                    <div
                      key={leaderboard.username}
                      className="grid grid-cols-2 py-3 items-center"
                    >
                      <div className="px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
                        {leaderboard.username}
                      </div>
                      <div className="flex flex-row justify-center text-sm">
                        <div
                          title="wins"
                          className="text-green-600 font-extrabold px-1.5 dark:text-green-400"
                        >
                          {leaderboard.wins}
                        </div>
                        <div
                          title="draws"
                          className="text-orange-500 font-extrabold px-1.5 dark:text-orange-400"
                        >
                          {leaderboard.draws}
                        </div>
                        <div
                          title="losses"
                          className="text-red-600 font-extrabold px-1.5 dark:text-red-500"
                        >
                          {leaderboard.losses}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="col-span-1 grid grid-rows-4 min-w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="row-start-2 text-center">
            <h1 className="text-white font-bold text-xl p-8">
              Vous devez être connecté pour voir le classement
            </h1>
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <Link to={"/login"}>Login</Link>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

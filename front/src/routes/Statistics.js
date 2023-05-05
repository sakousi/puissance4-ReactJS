import { useLazyQuery, useMutation } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GET_ALL_GAMES, LOGIN } from "../API/userRequest";
import Header from "../components/Header";
import { AppContext } from "../context/appContext";

export default function Statistics() {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [getAllGames] = useLazyQuery(GET_ALL_GAMES, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      setGames(data.getGamesByUserId);
      console.log(data.getGamesByUserId);
    },
  });

  useEffect(() => {
    getAllGames();
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      setLoading(false);
    }
  }, [games]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("fr-FR", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <>
      <Header></Header>
      <section className="flex justify-center items-center flex-col h-screen bg-gray-900">
        <h1 className="text-white text-4xl m-8">Statistics</h1>

        <ul>
          {games &&
            appContext.currentUser &&
            games?.map((game) => {
              if (!game) return;
              const winner = game.winner === appContext.currentUser.id;
              return (
                <li className="flex flex-row items-center justify-between text-base sm:text-lg rounded-3xl py-1 px-5 bg-gray-800 my-1.5" key={game.id}>
                  <p className="text-white">{formatDate(game.dateStarted)}</p>
                  <p
                    className={`${
                      winner ? "text-green-600" : "text-red-600"
                    } font-semibold px-2`}
                  >
                    {winner ? "Victory" : "Defeat"}
                  </p>
                  <p
                    className={`${
                      winner ? "text-green-600" : "text-red-600"
                    } font-semibold px-2`}
                  >
                    {winner
                      ? '+' + game.eloChange.player1EloChange + ' Elo'
                      : game.eloChange.player2EloChange  + ' Elo'}
                  </p>
                  <button
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('replay')
                      }}
                      className="text-white h-fit bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-sm w-auto px-3 py-0.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                    >
                      Replay
                    </button>
                </li>
              );
            })}
        </ul>
      </section>
    </>
  );
}

import { useLazyQuery, useMutation } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GET_ALL_GAMES, LOGIN } from "../API/userRequest";
import Header from "../components/Header";
import { AppContext } from "../context/appContext";

export default function Statistics() {
  const appContext = useContext(AppContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [getAllGames] = useLazyQuery(GET_ALL_GAMES, {
    fetchPolicy: "no-cache",
    onCompleted(data) {
      setGames(data.getGamesByUserId);
    },
  });

  useEffect(() => {
    if (appContext.currentUser) {
      getAllGames({ variables: { id: appContext.currentUser.id } });
    }
  }, [appContext.currentUser, getAllGames]);

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
      <section className="flex items-center flex-col h-screen pt-10 bg-gray-900">
        <h1 className="text-white text-4xl m-8">Statistics</h1>

        <table>
          <tbody>
            <tr className="bg-gray-800 text-gray-500 text-sm sm:text-lg">
              <td className="text-left hiddentable">
                <span className="paddingtr">Date</span>
              </td>
              <td className="text-left p-3">Opponent</td>
              <td className="text-left p-3">Result</td>
              <td className="text-left p-3">Elo change</td>
              <td className="text-left p-3 hiddentable">
                <span className="paddingtr">Actual Elo</span>
              </td>
            </tr>
            {games &&
              appContext.currentUser &&
              games?.map((game) => {
                const winner = game.winner === appContext.currentUser.id;
                return (
                  <tr
                    className="borderstats bg-gray-800 hover:bg-gray-700 text-white text-base sm:text-lg"
                    key={game.id}
                  >
                    <td className="hiddentable ">
                      <span className="paddingtr">
                        {formatDate(game.dateStarted)}
                      </span>
                    </td>
                    <td className=" paddingtr px-3">
                      {game.player1.id === appContext.currentUser.id
                        ? game.player2.username
                        : game.player1.username}
                    </td>
                    <td
                      className={`${
                        winner ? "text-green-600" : "text-red-600"
                      } font-semibold px-3`}
                    >
                      {winner ? "Victory" : "Defeat"}
                    </td>
                    <td
                      className={`${
                        winner ? "text-green-600" : "text-red-600"
                      } font-semibold px-3`}
                    >
                      {winner
                        ? "+" + game.eloChange.player1EloChange + " Elo"
                        : game.eloChange.player2EloChange + " Elo"}
                    </td>
                    <td className="hiddentable px-3">
                      <span className="paddingtr">
                        {game.player1.id === appContext.currentUser.id
                          ? parseInt(game.player1.elo) +
                            parseInt(game.eloChange.player1EloChange)
                          : parseInt(game.player2.elo) +
                            parseInt(game.eloChange.player2EloChange)}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </section>
    </>
  );
}

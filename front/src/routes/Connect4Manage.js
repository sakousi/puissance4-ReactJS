import Header from "../components/Header";
import Store from "../components/Connect4/Store";
import GameType from "../components/Connect4/GameType";
import Leaderboard from "../components/Connect4/Leaderboard";
import Connect4GameProvider from "../context/Connect4GameContext";

export default function Connect4Manage() {
  return (
    <>
      <Header></Header>
      <section className="flex flex-col bg-gray-900 min-h-screen">
        <h1 className="text-white text-6xl my-4 text-center">Connect 4</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3  mx-4 sm:mx-14 my-8 gap-8">
          {/* <Store></Store> */}
          <GameType></GameType>
          <Leaderboard></Leaderboard>
        </div>
      </section>
    </>
  );
}

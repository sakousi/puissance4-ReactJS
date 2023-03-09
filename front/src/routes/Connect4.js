import Header from "../components/Header";
import io from "socket.io-client";
import Store from "../components/Connect4/Store";
import GameType from "../components/Connect4/GameType";
import Leaderboard from "../components/Connect4/Leaderboard";

export default function Connect4() {

  const socket = io.connect("http://localhost:3101");

  return (
    <>
      <Header></Header>
      <section className="flex flex-col dark:bg-gray-900 h-screen">
        <h1 className="text-white text-5xl text-center">Connect 4</h1>
        <div className="grid grid-cols-4 mx-14 my-8 gap-8">
          <Store></Store>
          <GameType></GameType>
          <Leaderboard></Leaderboard>
        </div>
      </section>
    </>
  );
}

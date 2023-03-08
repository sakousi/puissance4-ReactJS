import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AppContext } from "../context/appContext";

export default function Connect4() {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <>
      <Header></Header>
      <section className="dark:bg-gray-900 h-screen">
        <h1 className="text-white text-5xl">Connect 4</h1>
      </section>
    </>
  );
}

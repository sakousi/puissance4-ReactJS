import { useLazyQuery, useMutation } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CHANGE_PASSWORD } from "../API/userRequest";
import Header from "../components/Header";
import { AppContext } from "../context/appContext";

export default function Settings() {
  const appContext = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [changePassword, { data, loading, error }] = useMutation(
    CHANGE_PASSWORD,
    {
      onCompleted(data) {
        console.log(data);
      },
    }
  );

  return (
    <>
      <Header></Header>
      <section className="flex justify-center items-center flex-col h-screen bg-gray-900">
        <h1 className="text-white text-4xl m-8">Settings</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            changePassword({
              variables: {
                email: email,
                currentPassword: currentPassword,
                newPassword: newPassword,
              },
            });
          }}
        >
          <p className="text-red-600 text-lg">
            {error && <span>{error.message}</span>}
          </p>
          <p className="text-green-600 text-lg">
            {data && <span>{data?.changePassword && "Password Updated"}</span>}
          </p>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-gray-900 text-white">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="john.doe@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            ></input>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-gray-900 text-white">
              Current password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="•••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            ></input>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-gray-900 text-white">
              New password
            </label>
            <input
              type="password"
              id="newpassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="•••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            ></input>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </section>
    </>
  );
}

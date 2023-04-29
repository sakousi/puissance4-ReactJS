import { useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN } from "../API/userRequest";
import Header from "../components/Header";
import { AppContext } from "../context/appContext";

export default function Login() {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [login] = useMutation(LOGIN, {
    onCompleted(data) {
      appContext.setLoggedIn(true);
      appContext.setCurrentUser(data.login.user);
      if (rememberMe) {
        localStorage.setItem("token", data.login.token);      
      }
      navigate("/");
    },
  });

  return (
    <>
      <Header></Header>
      <section className="flex justify-center items-center flex-col h-screen bg-gray-900">
        <h1 className="text-white text-4xl m-8">Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login({
              variables: {
                email: email,
                password: password,
              },
            });
          }}
        >
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
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="•••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 bg-gray-700 border-gray-600 focus:ring-blue-600 ring-offset-gray-800"
              ></input>
            </div>
            <label className="ml-2 text-lg font-medium text-gray-900 text-gray-300">
              Remember me
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
        <Link to={"/register"} className="text-white text-lg my-6">
          Create an account
        </Link>
      </section>
    </>
  );
}

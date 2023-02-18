import "./reset.css";
import "./App.css";
import "./index.css";
// import io from "socket.io-client";
import { UPDATE_USER } from "./API/userRequest";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

// const socket = io.connect("http://localhost:3101");

export default function App() {
  // const [updateUser] = useMutation(UPDATE_USER, {
  //   update(cache, { data: { updateUser } }) {
  //     cache.modify({
  //       fields: {
  //         users(existingUsers = []) {
  //           const newUserRef = cache.writeFragment({
  //             data: updateUser,
  //             fragment: gql`
  //               fragment NewUser on User {
  //                 id
  //                 username
  //                 email
  //                 password
  //                 places
  //               }
  //             `,
  //           });
  //           return [...existingUsers, newUserRef];
  //         },
  //       },
  //     });
  //   },
  // });

  // variables: {
  // id: "EFE4E8FE7T8R54D7",
  // username: "Patrice",
  // email: "patrice@gmail.com",
  // password: "password",
  // },

  const [userInput, setUserInput] = useState("");
  const [updateUser] = useMutation(UPDATE_USER);

  return (
    <div className="bg-black h-screen">
      <h2 className="text-white">My first Apollo app 🚀</h2>
      <form
        className="formInput"
        onSubmit={(e) => {
          e.preventDefault();
          updateUser({
            variables: {
              id: "EFE4E8FE7T8R54D7",
              username: userInput,
              email: "patricdfee@gmail.com",
              password: "password",
            },
          });
        }}
      >
        <input
          className="input"
          placeholder="What needs to be done?"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <i className="inputMarker fa fa-angle-right" />
      </form>
    </div>
  );
}

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ApolloClient, InMemoryCache, gql, ApolloProvider } from "@apollo/client";

// http://localhost:3000
// mongodb://admin:password@localhost:27017

const client = new ApolloClient({
  uri: "http://localhost:3101/graphql",
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);


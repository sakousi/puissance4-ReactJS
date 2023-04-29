const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const { connectDB } = require("./db");
const http = require("http");
const https = require("https");
const fs = require("fs");
const { Server } = require("socket.io");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { applyMiddleware } = require("graphql-middleware");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { authenticate } = require("./middleware/authUser");
const { permissions } = require("./middleware/permissions");
const app = express();
const { config } = require("dotenv");
const validateEnv = require("./utils/validateEnv");
const { createSockets } = require("./sockets/index");

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });

app.use(cors());

app.use(
  bodyParser.json({
    limit: "50mb",
    extended: true,
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use(authenticate);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: applyMiddleware(schema, permissions),
    // graphiql: true,
  })
);

let httpsServer = null;

if (process.env.NODE_ENV === "production") {
  httpsServer = https.createServer(
    {
      key: fs.readFileSync(process.env.PRIVKEY),
      cert: fs.readFileSync(process.env.CERT),
      ca: fs.readFileSync(process.env.CHAIN),
    },
    app
  );
} else {
  httpsServer = http.createServer(app);
}

async function startApolloServer() {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const user = authenticate(req);
      return { user };
    },
  });
  await server.start();
  server.applyMiddleware({ app });
}

// Start APOLLO SERVER
startApolloServer();

// Connect to DB
connectDB();

// server socket
createSockets(httpsServer);

httpsServer.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}/`);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 🔥 Shutting down...");
  console.error("Error🔥", err.message);
  process.exit(1);
});

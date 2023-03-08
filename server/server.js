const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const { connectDB } = require("./db");
const http = require("http");
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
dotenv.config();
validateEnv();

// const authUser = require("./middleware/authUser");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

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

const httpServer = http.createServer(app);

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
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}/`);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 🔥 Shutting down...");
  console.error("Error🔥", err.message);
  process.exit(1);
});

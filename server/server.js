const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const { connectDB } = require("./db");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { applyMiddleware } = require("graphql-middleware");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = require("./app");
const { config } = require("dotenv");
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

app.use(
  "/graphql",
  graphqlHTTP({
    schema: applyMiddleware(schema),
    // graphiql: true,
  })
);

const httpServer = http.createServer(app);

async function startApolloServer() {
  const server = new ApolloServer({
    schema,
    context: async ({ req, res }) => ({ req, res }),
  });
  await server.start();
  server.applyMiddleware({ app });
}

// Start APOLLO SERVER
startApolloServer();

// Connect to DB
connectDB();

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

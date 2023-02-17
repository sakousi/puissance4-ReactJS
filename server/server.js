const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const { connectDB } = require("./db");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { applyMiddleware } = require("graphql-middleware");
// const { updateUser } = require("./graphql/User/mutations");
connectDB();
// updateUser();

app.use(cors());

const httpServer = http.createServer(app);
// const server = new ApolloServer({ schema });
// await server.start();
// server.applyMiddleware({ app });

async function startApolloServer() {
  const server = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({ app });
}

app.use(
  "/graphql",
  graphqlHTTP({
    schema: applyMiddleware(schema),
    graphiql: true,
  })
);

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

httpServer.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});

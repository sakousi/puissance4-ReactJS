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
connectDB();

app.use(cors());

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
    // graphiql: true,
  })
);

const httpServer = http.createServer(app);

startApolloServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3100",
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

httpServer.listen(3101, () => {
  console.log(`Listening on http://localhost:3101/`);

});

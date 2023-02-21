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
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken");
connectDB();
app.use(cookieParser());
app.use(cors());

app.use(
  bodyParser.json({
    limit: '50mb',
    extended: true,
  })
);
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  })
);

app.get("/", (req, res) => {
  console.log(req.cookies);
  console.log('Signed Cookies: ', req.signedCookies)
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: applyMiddleware(schema),
    // graphiql: true,
  })
);

const httpServer = http.createServer(app);

async function startApolloServer() {
  const server = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer();

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

httpServer.listen(3101, () => {
  console.log(`Listening on http://localhost:3101/`);
});

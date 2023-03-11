import io from "socket.io-client";

const socket = io.connect("http://localhost:3101");

export default socket;
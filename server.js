const express = require("express");
const app = express();
const socketio = require("socket.io");
const cors = require("cors");

let namespaces = require("./data/namespaces");

app.use(cors());

const expressServer = app.listen(9000, () => {
  console.log(`App listening on port 9000`);
});

const io = socketio(expressServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  socket.emit("messageFromServer", "Welcome to the socket.io server!");
  socket.on("messageToServer", (dataFromClient) => {
    console.log(dataFromClient);
  });
  socket.on("newMessageToServer", (msg) => {
    io.of("/").emit("messageToClients", { text: msg.text });
  });
});

// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  //   console.log(namespace);
  io.of(namespace.endpoint).on("connection", (socket) => {
    console.log(`${socket.id} has joined ${namespace.endpoint}`);
  });
});

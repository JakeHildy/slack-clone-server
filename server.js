const express = require("express");
const app = express();
const socketio = require("socket.io");
const cors = require("cors");

app.use(cors());

const expressServer = app.listen(9000, () => {
  console.log(`App listening on port 9000`);
});

const io = socketio(expressServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  socket.emit("messageFromServer", {
    data: "Welcome to the socket.io server!",
  });
  socket.on("messageToServer", (dataFromClient) => {
    console.log(dataFromClient);
  });
  socket.on("newMessageToServer", (msg) => {
    console.log(msg);
    io.emit("messageToClients", { text: msg.text });
    io.of("/").emit("messageToClients", { text: msg.text });
  });
});

io.of("/admin").on("connection", (socket) => {
  console.log("someone connected to the admin namespace.");
  io.of("/admin").emit("welcome", "Welcome to the admin channel");
});

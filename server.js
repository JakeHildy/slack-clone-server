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
  // build an array to send back with the img and endpoint for each NS
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });

  // send nsData back to the client. We need to use socket, NOT io
  // because we want it to go to just client.
  socket.emit("nsList", nsData);
});

// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  //   console.log(namespace);
  io.of(namespace.endpoint).on("connection", (socket) => {
    console.log(`${socket.id} has joined ${namespace.endpoint}`);
  });
});

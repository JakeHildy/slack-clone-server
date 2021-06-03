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
  // because we want it to go to just the client.
  socket.emit("nsList", nsData);
});

// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);

    // Send the ns group info back
    nsSocket.emit("nsRoomLoad", namespace.rooms);
    nsSocket.on("joinRoom", async (roomToJoin, numberOfUsersCallback) => {
      // Deal with history TODO
      console.log("joining room", roomToJoin);
      nsSocket.join(roomToJoin);
      const allSockets = await io
        .of(namespace.endpoint)
        .in(roomToJoin)
        .allSockets();
      const clients = Array.from(allSockets);
      numberOfUsersCallback(clients.length);
    });
    nsSocket.on("newMessageToServer", (msg) => {
      // Send this mesage to ALL the sockets that are in the room that THIS socket is in.
      //   console.log(nsSocket.rooms);
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: "jake",
        avatar: "http://via.placeholder.com/30",
      };
      const roomTitle = Array.from(nsSocket.rooms);
      console.log(fullMsg);
      io.of(namespace.endpoint)
        .to(roomTitle[1])
        .emit("messageToClients", fullMsg);
    });
  });
});

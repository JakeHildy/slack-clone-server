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

///////////////////////////////////////
// === CONNECTION TO MAIN NAMESPACE ===
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

////////////////////////////////////////////////////////
// === BUILD CONNECTION HANDLERS FOR EACH NAMESPACE ===
// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    // Get username from query parameters
    const username = nsSocket.handshake.query.username;

    // Send the ns group info back
    nsSocket.emit("nsRoomLoad", namespace.rooms);

    // A user joins a room
    nsSocket.on("joinRoom", async (roomToJoin) => {
      // --- LEAVE CURRENT ROOM ---
      // Get Current Room Name
      const currentRoom = Array.from(nsSocket.rooms)[1];
      nsSocket.leave(currentRoom);
      // Get number of users in that room now that this user has left.
      const updatedNumUsers = await getNumUsersInRoom(
        namespace.endpoint,
        currentRoom
      );
      io.of(namespace.endpoint)
        .in(currentRoom)
        .emit("updateMembers", updatedNumUsers);

      // --- JOIN NEW ROOM ---
      nsSocket.join(roomToJoin);

      // Find the current room object
      const nsRoom = namespace.rooms.find(
        (room) => room.roomTitle === Array.from(nsSocket.rooms)[1]
      );

      // Send out the room history to client
      if (nsRoom) nsSocket.emit("historyCatchUp", nsRoom.history);

      // Send back the number of users in this room to ALL sockets connected to this roomTitle
      const numUsers = await getNumUsersInRoom(namespace.endpoint, roomToJoin);
      io.of(namespace.endpoint).in(roomToJoin).emit("updateMembers", numUsers);
    });

    // Helper function to get the number of users in a room
    const getNumUsersInRoom = (namespace, room) => {
      return new Promise(async (resolve, reject) => {
        try {
          const allSockets = await io.of(namespace).in(room).allSockets();
          const clients = Array.from(allSockets);
          resolve(clients.length);
        } catch (error) {
          reject(new Error(error));
        }
      });
    };

    // A User sends a new message to the server.
    nsSocket.on("newMessageToServer", (msg) => {
      // Send this mesage to ALL the sockets that are in the room that THIS socket is in.
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: username,
        avatar: "http://via.placeholder.com/30",
      };
      const roomTitle = Array.from(nsSocket.rooms);

      // We need to find the Room object for this room
      const nsRoom = namespace.rooms.find(
        (room) => room.roomTitle === roomTitle[1]
      );
      nsRoom.addMessage(fullMsg);

      io.of(namespace.endpoint)
        .to(roomTitle[1])
        .emit("messageToClients", fullMsg);
    });
  });
});




// Main below


// import express from "express";
// import { createServer } from "http";
// import { Server as SocketIOServer } from "socket.io";

// const port = 3000;

// const app = express();
// const Server = createServer(app);
// const io = new SocketIOServer(Server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// io.on("connection", (socket) => {
//   console.log("User connected, id:", socket.id);

//   socket.on('disconnect', () => {
//     console.log(`${socket.id} is disconnected`);
//   });

//   socket.on("message", ({ msg, room, senderId }) => {
//     // Broadcast the message to all clients in the specified room, including the sender
//     io.to(room).emit("recieved-message", { msg, senderId });
//   });
// });

// Server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// Main up

import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";


const port = 3000;
const app = express();
const Server = createServer(app);
const io = new SocketIOServer(Server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

function generateSessionKey() {
  return Math.random().toString(36).substring(2, 11);
}

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("User connected, id:", socket.id);

  socket.on('disconnect', () => {
    console.log(`${socket.id} is disconnected`);
  });

  socket.on("message", ({ msg, room, senderId }) => {
    io.to(room).emit("recieved-message", { msg, senderId });
  });

  socket.on("generate_key", () => {
    const key = generateSessionKey(); // Generate a unique key
    socket.emit("key_generated", key);
  });

  socket.on("join_session", (key) => {
    // Assuming you have some logic to handle the session join
    // socket.join(key);
    console.log(`${socket.id} joined session with key ${key}`);
  });
});

Server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


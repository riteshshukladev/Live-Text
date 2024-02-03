


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

// const session={};
// function generateSessionKey() {
//   return Math.random().toString(36).substring(2, 11);
// }

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// io.on("connection", (socket) => {
//   console.log("User connected, id:", socket.id);

//   socket.on('disconnect', () => {
//     console.log(`${socket.id} is disconnected`);
//   });

//   socket.on("message", ({ msg, room, senderId }) => {
//     io.to(room).emit("received-message", { msg, senderId }); // Ensure to use 'received-message' here
//   });

//   socket.on("generate_key", (value) => {
//     const key = generateSessionKey();
//     socket.emit("key_generated", key);
//     socket.join(key); // Join the room after generating key
//   });

//   socket.on("join_session", (key) => {
//     socket.join(key); // Join the room for the session
//     console.log(`${socket.id} joined session with key ${key}`);
//   });
// });

// Server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


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

// const sessions = {};  // Store session keys and associated socket IDs

// function generateSessionKey() {
//   return Math.random().toString(36).substring(2, 11);
// }

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// io.on("connection", (socket) => {
//   console.log("User connected, id:", socket.id);

//   socket.on('disconnect', () => {
//     console.log(`${socket.id} is disconnected`);
//     // Remove the socket ID from sessions if it's there
//     for (const key in sessions) {
//       if (sessions[key] === socket.id) {
//         delete sessions[key];
//         break;
//       }
//     }
//   });

//   socket.on("message", ({ msg, room, senderId }) => {
//     io.to(room).emit("received-message", { msg, senderId });
//   });

//   socket.on("generate_key", () => {
//     const key = generateSessionKey();
//     sessions[key] = socket.id;
//     socket.emit("key_generated", key);
//     socket.join(key);
//   });

//   socket.on("join_session", (key) => {
//     if (sessions[key]) {
//       socket.join(key);
//       socket.emit("join_success", sessions[key]); // Emitting the stored socket ID
//       console.log(`${socket.id} joined session with key ${key}`);
//     } else {
//       socket.emit("join_fail", "Invalid key");
//     }
//   });
// });

// Server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const port = 3000;
const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const sessions = {};  // Store session keys and associated socket IDs

function generateSessionKey() {
  return Math.random().toString(36).substring(2, 11);
}

app.get("/", (req, res) => {
  res.send("Chat Server Running");
});

io.on("connection", (socket) => {
  console.log("User connected, id:", socket.id);

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
    for (const key in sessions) {
      const index = sessions[key].indexOf(socket.id);
      if (index !== -1) {
        sessions[key].splice(index, 1);
        if (sessions[key].length === 0) {
          delete sessions[key];
        }
        break;
      }
    }
  });

  socket.on("message", ({ msg, room, senderId }) => {
    io.to(room).emit("received-message", { msg, senderId });
  });

  socket.on("generate_key", () => {
    const key = generateSessionKey();
    sessions[key] = [socket.id];
    socket.emit("key_generated", key);
    socket.join(key);
  });

  socket.on("join_session", (key) => {
    if (sessions[key] && !sessions[key].includes(socket.id)) {
      sessions[key].push(socket.id);
      socket.join(key);
      socket.emit("join_success", key);
      console.log(`${socket.id} joined session with key ${key}`);
    } else {
      socket.emit("join_fail", "Invalid key or already in session");
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

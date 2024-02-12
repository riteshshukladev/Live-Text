

import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from 'dotenv';
import { query } from "./db.js";
dotenv.config();



const port = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Chat Server Running");
});

io.on("connection", (socket) => {
  console.log("User connected, id:", socket.id);

  socket.on('disconnect', async () => {
    console.log(`${socket.id} disconnected`);
    try {
      await query('UPDATE sessions SET socket_ids = array_remove(socket_ids, $1) WHERE $1 = ANY(socket_ids)', [socket.id]);
      await query('DELETE FROM sessions WHERE array_length(socket_ids, 1) IS NULL');
    } catch (err) {
      console.error('Error updating sessions on disconnect:', err);
    }
  });

  socket.on("generate_key", async () => {
    const key = Math.random().toString(36).substring(2, 15);
    try {
      await query('INSERT INTO sessions(session_key, socket_ids) VALUES($1, $2)', [key, [socket.id]]);
      socket.emit("key_generated", key);
      socket.join(key);
      console.log(`Session key generated and joined: ${key}`);
    } catch (err) {
      console.error('Error generating key:', err);
    }
  });

  socket.on("join_session", async (key) => {
    try {
      const { rows } = await query('SELECT socket_ids FROM sessions WHERE session_key = $1', [key]);
      if (rows.length > 0 && !rows[0].socket_ids.includes(socket.id)) {
        await query('UPDATE sessions SET socket_ids = array_append(socket_ids, $1) WHERE session_key = $2', [socket.id, key]);
        socket.join(key);
        socket.emit("join_success", key);
        console.log(`Socket ${socket.id} joined session: ${key}`);
      } else {
        socket.emit("join_fail", "Invalid key or already in session");
      }
    } catch (err) {
      console.error('Error joining session:', err);
    }
  });

  socket.on("message", ({ msg, room, senderId }) => {
    io.to(room).emit("received-message", { msg, senderId });
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
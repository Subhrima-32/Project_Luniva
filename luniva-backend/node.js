// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" }, // frontend port
});

let stats = {
  followers: 50,
  following: 26,
  posts: 10,
  likes: 503,
};

io.on("connection", (socket) => {
  console.log("⚡ A user connected");

  // Send initial stats to new client
  socket.emit("statsUpdate", stats);

  // Listen for updates from Profile.js
  socket.on("updateStats", (data) => {
    stats = data;
    io.emit("statsUpdate", stats); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});

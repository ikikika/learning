require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FE_URL,
    methods: ["GET", "POST"],
  },
});

let players = {};
io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("disconnect", function () {
    console.log(`user disconnected: ${socket.id}`);
    delete players[socket.id];
  });

  socket.on("event_new_player", () => {
    players[socket.id] = {
      x: 0,
      y: 0,
    };
  });

  socket.on("event_offset", (data) => {
    let player = players[socket.id] || {};
    player.x = data.x;
    player.y = data.y;
  });
});

setInterval(function () {
  io.sockets.emit("broadcast_players", players);
  
}, 1000 / 60);

server.listen(3001, () => {
  console.log("server is running");
});

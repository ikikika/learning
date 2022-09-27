const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("event_name", data => {
    // console.log(data);
    socket.broadcast.emit("broadcast_event_name", data)
  })
});

server.listen(3001, () => {
  console.log("server is running");
});

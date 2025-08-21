// const winston = require("winston");
const express = require("express");
const config = require("config");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);

// require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")

// Initialize Socket.io with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:4200", "https://green-hospital.netlify.app"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store io instance in app for use in routes
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user authentication for socket
  socket.on('authenticate', (userData) => {
    socket.userId = userData.userId;
    socket.userEmail = userData.userEmail;
    socket.isAdmin = userData.isAdmin;
    console.log(`User authenticated: ${userData.userEmail}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const port = process.env.PORT || config.get("port");
server.listen(port, () =>
  console.log(`Listening on port ${port}...`)
  // winston.info(`Listening on port ${port}...`)
);

module.exports = server;

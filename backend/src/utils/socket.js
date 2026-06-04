const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const { accessTokenSecret } = require("../config/jwt");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.cookie
          ?.split(";")
          .find((item) => item.trim().startsWith("access_token="))
          ?.split("=")[1];

      if (token) {
        const decoded = jwt.verify(token, accessTokenSecret);
        socket.join(`user:${decoded.id}`);
        console.log(`Socket ${socket.id} joined user:${decoded.id}`);
      }
    } catch (error) {
      console.warn("Socket auth skipped:", error.message);
    }

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => io;

const emitToAll = (event, payload) => {
  if (io) {
    io.emit(event, payload);
  }
};

const emitToUser = (userId, event, payload) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, payload);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToAll,
  emitToUser,
};

const { Server } = require("socket.io");
const {
  extractSocketToken,
  authenticateSocketToken,
} = require("./socketAuth");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    try {
      const token = extractSocketToken(socket);
      const { decoded } = await authenticateSocketToken(token);

      socket.join(`user:${decoded.id}`);
      console.log(`Socket ${socket.id} joined user:${decoded.id}`);
    } catch (error) {
      console.warn("Socket auth rejected:", error.message);
      socket.emit("error", { message: error.message });
      socket.disconnect(true);
      return;
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

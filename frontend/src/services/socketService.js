import { io } from "socket.io-client";

const SOCKET_URL = (
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080"
).replace(/\/api$/, "");

let socket = null;

const getAuthToken = () => {
  if (typeof document === "undefined") return "";

  const match = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith("access_token="));

  return match ? decodeURIComponent(match.split("=")[1]) : "";
};

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: { token: getAuthToken() },
      transports: ["websocket", "polling"],
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const listenToSocket = (eventName, callback) => {
  const currentSocket = connectSocket();
  currentSocket.on(eventName, callback);

  return () => currentSocket.off(eventName, callback);
};

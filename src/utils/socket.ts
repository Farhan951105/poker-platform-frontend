import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:3001"; // Change if your server runs elsewhere

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(SERVER_URL, {
      autoConnect: true,
      transports: ["websocket"],
    });
  }
  return socket;
} 
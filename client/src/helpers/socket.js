import { io } from "socket.io-client";

const authToken = localStorage.getItem("authToken");

const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080', {
  withCredentials: true,
  auth:{
    token: authToken,
  }
});

export default socket;
import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  if (socket && socket.connected) {
    return socket; // prevent duplicate connections
  }
  
  const authToken = localStorage.getItem("authToken");
  // const backendUrl = 'http://localhost:8080'
  const backendUrl = 'https://sanyug-server.onrender.com'

  socket = io(backendUrl, {
    transports: ["websocket"],
    // withCredentials: true,
    auth: {
      token: authToken,  
    },
  });

  let pingInterval, pongCheckInterval;

  // Heartbeat: send ping every 10s
  pingInterval = setInterval(() => {
    if (socket.connected) {
      socket.emit("ping");
    }
  }, 10000); // 10 seconds

  let lastPong = Date.now();
  // Listen for pong from server
  socket.on("pong", () => {
    console.log("Server is alive (pong received)");
    lastPong = Date.now(); // update timestamp
  });

  // Check every 15s if pong is missing
  pongCheckInterval = setInterval(() => {
    if (Date.now() - lastPong > 15000) {
      console.warn("No pong received, reconnecting...");
      socket.disconnect();
      socket.connect();
    }
  }, 15000);

  socket.on("disconnect", () => {
    clearInterval(pingInterval);
    clearInterval(pongCheckInterval);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () =>{
  if(socket){
    socket.disconnect();
    socket=null;
  }
}
import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  const authToken = localStorage.getItem("authToken");

  // if(socket){
    socket = io("http://localhost:8080", {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: authToken,  
      },
    });
  // }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () =>{
  if(socket){
    socket.disconnect();
    socket=null;
  }
}
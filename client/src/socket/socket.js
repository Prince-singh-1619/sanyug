// import { useSelector } from "react-redux";
import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  if (socket && socket.connected) {
    return socket; // prevent duplicate connections
  }
  
  const authToken = localStorage.getItem("authToken");
  // const { authToken } = useSelector(state => state.user)
  // console.log("authToken in socket", authToken)
  const backendUrl = 'http://localhost:8080'

  // if(socket){
    socket = io(backendUrl, {
      transports: ["websocket"],
      // withCredentials: true,
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
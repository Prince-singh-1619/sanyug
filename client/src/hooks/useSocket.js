import { useEffect, useState, useCallback } from 'react';
import { initializeSocket } from '../helpers/socket';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = initializeSocket();
    
    if (socketInstance) {
      setSocket(socketInstance);
      
      socketInstance.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected');
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });
    }

    return () => {
      if (socketInstance) {
        socketInstance.removeAllListeners();
      }
    };
  }, []);

  const joinRoom = useCallback((roomId) => {
    if (socket && isConnected) {
      socket.emit('joinRoom', roomId);
    }
  }, [socket, isConnected]);

  const leaveRoom = useCallback((roomId) => {
    if (socket && isConnected) {
      socket.emit('leaveRoom', roomId);
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    joinRoom,
    leaveRoom
  };
};
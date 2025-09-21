"use client";

import { createContext, useContext, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { useSocket, usePresence, useChat, useRooms, useLeaderboard } from '@/hooks/useSocket';

const SocketContext = createContext();

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Initialize socket connection
  const socketData = useSocket(user?.uid, user?.username);
  const { socket, isConnected } = socketData;
  console.log(socket, isConnected)
  // Initialize feature hooks
  const presence = usePresence(socket, isConnected);
  const chat = useChat(socket, isConnected);
  const rooms = useRooms(socket, isConnected);
  const leaderboard = useLeaderboard(socket, isConnected);

  const value = {
    ...socketData,
    presence,
    chat,
    rooms,
    leaderboard,
    user
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
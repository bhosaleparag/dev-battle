"use client";

import { createContext, useContext, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { useSocket, usePresence, useChat, useRooms, useLeaderboard, useFriends } from '@/hooks/useSocket';

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

  // Initialize feature hooks
  const presenceState = usePresence(socket, isConnected);
  const chatState = useChat(socket, isConnected);
  const roomsState = useRooms(socket, isConnected);
  const leaderboardState = useLeaderboard(socket, isConnected);
  const friendsState = useFriends(socket, isConnected);

  const value = {
    ...socketData,
    presenceState,
    chatState,
    roomsState,
    friendsState,
    leaderboardState,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
"use client";

import { createContext, useContext, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { useSocket, usePresence, useChat, useRooms, useLeaderboard, useFriends, useAchievements } from '@/hooks/useSocket';
import toJavaScriptDate from '@/utils/toJavaScriptDate';

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
  const { socket, isConnected, emitEvent } = socketData;

  // Initialize feature hooks
  const presenceState = usePresence(socket, isConnected);
  const chatState = useChat(socket, isConnected);
  const roomsState = useRooms(socket, isConnected, user);
  const leaderboardState = useLeaderboard(socket, isConnected);
  const friendsState = useFriends(socket, isConnected, user);
  const achievementState = useAchievements(socket, isConnected, user);

  useEffect(() => {
    const today = new Date();
    const lastLoginDate = toJavaScriptDate(user?.lastSeen || new Date(Date.now() - 86400000));
    
    if (lastLoginDate !== today) {
      // Calculate streak
      const yesterday = new Date(Date.now() - 86400000);
      let currentStreak = user?.dailyLoginStreak || 0;
  
      if (lastLoginDate === yesterday) {
        currentStreak += 1; // Consecutive day
      } else {
        currentStreak = 1; // Streak broken
      }

      emitEvent('update-daily-streak', { 
        userId: user?.uid,
        currentStreak: currentStreak,
        today
      });
    }
  }, [socket, isConnected])
  
  const value = {
    ...socketData,
    presenceState,
    chatState,
    roomsState,
    friendsState,
    leaderboardState,
    achievementState
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
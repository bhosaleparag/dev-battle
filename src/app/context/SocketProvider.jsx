"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { useSocket, usePresence, useChat, useRooms, useLeaderboard, useFriends, useAchievements } from '@/hooks/useSocket';
import toJavaScriptDate from '@/utils/toJavaScriptDate';
import InviteNotification from '@/components/FriendMatch/InviteNotification';
import GameStartCountdown from '@/components/ui/GameStartCountdown';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [activeInviteNotification, setActiveInviteNotification] = useState(null);
  
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
  
  // for global notifications of invited matches
  const { currentRoom, acceptFriendInvite, declineFriendInvite, pendingInvites, countdown } = roomsState;

  const handleAcceptInvite = (inviteId) => {
    acceptFriendInvite(inviteId);
    setActiveInviteNotification(null);
  };

  const handleDeclineInvite = (inviteId) => {
    declineFriendInvite(inviteId);
    setActiveInviteNotification(null);
  };

  // Show notification for latest pending invite
  useEffect(() => {
    if (pendingInvites.length > 0) {
      setActiveInviteNotification(pendingInvites[0]);
    } else {
      setActiveInviteNotification(null);
    }
  }, [pendingInvites]);

  useEffect(() => { 
    if (!user || !socket || !isConnected) return
    
    const today = new Date();
    const lastLoginDate = toJavaScriptDate(user?.lastSeen || new Date(Date.now() - 86400000));
    
    // Normalize dates to compare only year/month/day (ignore time)
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const lastLoginDateOnly = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate());
    const yesterdayDateOnly = new Date(todayDateOnly);
    yesterdayDateOnly.setDate(yesterdayDateOnly.getDate() - 1);
    
    if (lastLoginDateOnly.getTime() !== todayDateOnly.getTime()) {
      let currentStreak = user?.dailyLoginStreak || 0;
      if (lastLoginDateOnly.getTime() === yesterdayDateOnly.getTime()) {
        currentStreak += 1; // Consecutive day
      } else {
        currentStreak = 1; // Streak broken, start fresh
      }


      emitEvent('update-daily-streak', { 
        userId: user?.uid,
        currentStreak: currentStreak,
        today: todayDateOnly
      });
    }
  }, [socket, isConnected, user, emitEvent]);
  
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

      {activeInviteNotification && (
        <InviteNotification
          invite={activeInviteNotification}
          onAccept={handleAcceptInvite}
          onDecline={handleDeclineInvite}
        />
      )}

      {countdown && (
        <GameStartCountdown 
          duration={countdown} 
          onComplete={() => {
            router.push(`${currentRoom?.gameSettings?.mode || 'quiz'}/${currentRoom?.gameSettings?._id}/${currentRoom.id}`)
          }} 
        />
      )}
    </SocketContext.Provider>
  );
};
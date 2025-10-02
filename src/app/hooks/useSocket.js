"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const useSocket = (userId, username) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const reconnectTimeoutRef = useRef(null);
  
  // Initialize socket connection
  useEffect(() => {
    if (!userId || !username) return;
    
    const socketInstance = io(SOCKET_URL, {
      auth: {
        userId: userId,
        username: username
      },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 3,
      timeout: 20000,
      transports: ['websocket', 'polling']
    });

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      setSocket(socketInstance);
      setIsConnected(true);
      setConnectionError(null);
      setReconnectAttempts(0);
      
      // Set initial presence
      socketInstance.emit('set-initial-presence');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Disconnected from socket server:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server forcefully disconnected, try to reconnect
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionError(error.message);
      setReconnectAttempts(prev => prev + 1);
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to socket server after', attemptNumber, 'attempts');
      setIsConnected(true);
      setConnectionError(null);
      setReconnectAttempts(0);
    });

    socketInstance.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
      setConnectionError(error.message);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      setConnectionError('Failed to reconnect to server');
    });

    // Global event handlers
    socketInstance.on('connection-established', (data) => {
      console.log('Connection established:', data);
    });

    socketInstance.on('user-connected', (data) => {
      setActiveUsers(prev => [...prev, data]);
    });

    socketInstance.on('user-disconnected', (data) => {
      setActiveUsers(prev => prev.filter(user => user.userId !== data.userId));
    });

    setSocket(socketInstance);

    return () => {
      console.log('Cleaning up socket connection');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socketInstance.disconnect();
    };
  }, [userId, username]);

  // Socket event listener hook
  const useSocketEvent = useCallback((event, handler) => {
    useSocketEvent(socket, isConnected, event, handler);
  }, [socket, isConnected]);

  // Emit socket event
  const emitEvent = useCallback((event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
      return true;
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
      return false;
    }
  }, [socket, isConnected]);

  // Manual reconnect
  const reconnect = useCallback(() => {
    if (socket && !isConnected) {
      socket.connect();
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    connectionError,
    activeUsers,
    reconnectAttempts,
    useSocketEvent,
    emitEvent,
    reconnect
  };
};

// Hook for user presence management
export const usePresence = (socket, isConnected) => {
  const [myPresence, setMyPresence] = useState('online');
  const [presenceStats, setPresenceStats] = useState({ online: 0, idle: 0, away: 0, total: 0 });

  // Update my presence status
  const updatePresence = useCallback((status) => {
    if (socket && isConnected) {
      socket.emit('update-presence', { status });
      setMyPresence(status);
    }
  }, [socket, isConnected]);

  // Get specific user's presence
  const getUserPresence = useCallback((userId) => {
    return new Promise((resolve) => {
      if (!socket || !isConnected) {
        resolve('offline');
        return;
      }

      const timeout = setTimeout(() => {
        resolve('offline');
      }, 3000);

      socket.once('user-presence', (data) => {
        clearTimeout(timeout);
        if (data.userId === userId) {
          resolve(data.presence);
        }
      });

      socket.emit('get-user-presence', { userId });
    });
  }, [socket, isConnected]);

  // Get multiple users' presence (useful for friend lists)
  const getUsersPresence = useCallback((userIds) => {
    return new Promise((resolve) => {
      if (!socket || !isConnected) {
        const fallback = {};
        userIds.forEach(uid => fallback[uid] = 'offline');
        resolve(fallback);
        return;
      }

      const timeout = setTimeout(() => {
        const fallback = {};
        userIds.forEach(uid => fallback[uid] = 'offline');
        resolve(fallback);
      }, 3000);

      socket.once('users-presence', (presences) => {
        clearTimeout(timeout);
        resolve(presences);
      });

      socket.emit('get-users-presence', { userIds });
    });
  }, [socket, isConnected]);

  // Set user to idle
  const setUserIdle = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('user-idle');
      setMyPresence('idle');
    }
  }, [socket, isConnected]);

  // Set user back to active
  const setUserActive = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('user-active');
      setMyPresence('online');
    }
  }, [socket, isConnected]);

  // Get presence statistics
  const getPresenceStats = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('get-presence-stats');
    }
  }, [socket, isConnected]);

  // Set initial presence when connected
  useEffect(() => {
    if (socket && isConnected) {
      socket.emit('set-initial-presence');
    }
  }, [socket, isConnected]);

  // Listen for presence events
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Handle presence update success
    socket.on('presence-update-success', (data) => {
      setMyPresence(data.status);
    });

    // Handle idle confirmation
    socket.on('idle-confirmed', () => {
      setMyPresence('idle');
    });

    // Handle active confirmation
    socket.on('active-confirmed', () => {
      setMyPresence('online');
    });

    // Handle presence stats
    socket.on('presence-stats', (data) => {
      setPresenceStats(data);
    });

    // Handle initial presence set
    socket.on('initial-presence-set', (data) => {
      setMyPresence(data.presence);
    });

    // Handle errors
    socket.on('presence-error', (error) => {
      console.error('Presence error:', error.message);
    });

    return () => {
      socket.off('presence-update-success');
      socket.off('idle-confirmed');
      socket.off('active-confirmed');
      socket.off('presence-stats');
      socket.off('initial-presence-set');
      socket.off('presence-error');
    };
  }, [socket, isConnected]);

  // Auto-detect idle/active based on user activity
  useEffect(() => {
    if (!socket || !isConnected) return;

    let idleTimer;
    const IDLE_TIME = 5 * 60 * 1000; // 5 minutes

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      
      // If user was idle, set back to active
      if (myPresence === 'idle') {
        setUserActive();
      }

      // Set new idle timer
      idleTimer = setTimeout(() => {
        if (myPresence === 'online') {
          setUserIdle();
        }
      }, IDLE_TIME);
    };

    // Activity events
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    activityEvents.forEach(event => {
      document.addEventListener(event, resetIdleTimer, true);
    });

    // Start initial timer
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetIdleTimer, true);
      });
    };
  }, [socket, isConnected, myPresence, setUserIdle, setUserActive]);

  // For friend list - get all friends' presence at once
  // useEffect(() => {
  //   if (friends.length > 0) {
  //     const friendIds = friends.map(f => f.uid);
  //     getUsersPresence(friendIds).then(presences => {
  //       // presences = { userId1: 'online', userId2: 'offline', ... }
  //       setFriendsWithPresence(friends.map(f => ({
  //         ...f,
  //         presence: presences[f.uid] || 'offline'
  //       })));
  //     });
  //   }
  // }, [friends, getUsersPresence]);

  // For single user
  // const checkUserPresence = async (userId) => {
  //   const presence = await getUserPresence(userId);
  //   console.log(`User ${userId} is ${presence}`);
  // };


  return {
    myPresence,
    presenceStats,
    updatePresence,
    getUserPresence,
    getUsersPresence,
    setUserIdle,
    setUserActive,
    getPresenceStats
  };
};

// Hook for chat functionality
export const useChat = (socket, isConnected) => {
  const [friendMessages, setFriendMessages] = useState([]);
  const [roomMessages, setRoomMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef = useRef({});

  const sendFriendMessage = useCallback((friendId, message) => {
    if (socket && isConnected) {
      socket.emit('send-friend-message', { friendId, message });
    }
  }, [socket, isConnected]);

  const sendRoomMessage = useCallback((roomId, message) => {
    if (socket && isConnected) {
      socket.emit('send-room-message', { roomId, message });
    }
  }, [socket, isConnected]);

  const getFriendChatHistory = useCallback((friendId, limit = 50, before = null) => {
    if (socket && isConnected) {
      socket.emit('get-friend-chat-history', { friendId, limit, before });
    }
  }, [socket, isConnected]);

  const getRoomChatHistory = useCallback((roomId, limit = 50, before = null) => {
    if (socket && isConnected) {
      socket.emit('get-room-chat-history', { roomId, limit, before });
    }
  }, [socket, isConnected]);

  const editMessage = useCallback((messageId, newMessage, chatType) => {
    if (socket && isConnected) {
      socket.emit('edit-message', { messageId, newMessage, chatType });
    }
  }, [socket, isConnected]);

  const deleteMessage = useCallback((messageId, chatType) => {
    if (socket && isConnected) {
      socket.emit('delete-message', { messageId, chatType });
    }
  }, [socket, isConnected]);

  const startTyping = useCallback((roomId = null, chatType = 'friend') => {
    if (socket && isConnected) {
      socket.emit('typing-start', { roomId, chatType });
    }
  }, [socket, isConnected]);

  const stopTyping = useCallback((roomId = null, chatType = 'friend') => {
    if (socket && isConnected) {
      socket.emit('typing-stop', { roomId, chatType });
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('new-friend-message', (message) => {
      setFriendMessages(prev => [...prev, message]);
    });

    socket.on('new-room-message', (message) => {
      setRoomMessages(prev => ({
        ...prev,
        [message.roomId]: [...(prev[message.roomId] || []), message]
      }));
    });

    socket.on('friend-chat-history', (data) => {
      setFriendMessages(data.messages);
    });

    socket.on('room-chat-history', (data) => {
      setRoomMessages(prev => ({
        ...prev,
        [data.roomId]: data.messages
      }));
    });

    socket.on('message-edited', (message) => {
      if (message.chatType === 'friend') {
        setFriendMessages(prev =>
          prev.map(msg => msg.id === message.id ? message : msg)
        );
      } else {
        setRoomMessages(prev => ({
          ...prev,
          [message.roomId]: prev[message.roomId]?.map(msg =>
            msg.id === message.id ? message : msg
          ) || []
        }));
      }
    });

    socket.on('message-deleted', (data) => {
      if (data.chatType === 'friend') {
        setFriendMessages(prev =>
          prev.filter(msg => msg.id !== data.messageId)
        );
      } else {
        setRoomMessages(prev => ({
          ...prev,
          [data.roomId]: prev[data.roomId]?.filter(msg =>
            msg.id !== data.messageId
          ) || []
        }));
      }
    });

    socket.on('user-typing', (data) => {
      setTypingUsers(prev => {
        const existing = prev.find(user => user.userId === data.userId);
        if (!existing) {
          return [...prev, data];
        }
        return prev;
      });

      // Clear typing after 3 seconds
      if (typingTimeoutRef.current[data.userId]) {
        clearTimeout(typingTimeoutRef.current[data.userId]);
      }
      
      typingTimeoutRef.current[data.userId] = setTimeout(() => {
        setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
        delete typingTimeoutRef.current[data.userId];
      }, 3000);
    });

    socket.on('user-stopped-typing', (data) => {
      setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
      if (typingTimeoutRef.current[data.userId]) {
        clearTimeout(typingTimeoutRef.current[data.userId]);
        delete typingTimeoutRef.current[data.userId];
      }
    });

    return () => {
      socket.off('new-friend-message');
      socket.off('new-room-message');
      socket.off('friend-chat-history');
      socket.off('room-chat-history');
      socket.off('message-edited');
      socket.off('message-deleted');
      socket.off('user-typing');
      socket.off('user-stopped-typing');
      
      // Clear all typing timeouts
      Object.values(typingTimeoutRef.current).forEach(timeout => {
        clearTimeout(timeout);
      });
      typingTimeoutRef.current = {};
    };
  }, [socket, isConnected]);

  return {
    friendMessages,
    roomMessages,
    typingUsers,
    sendFriendMessage,
    sendRoomMessage,
    getFriendChatHistory,
    getRoomChatHistory,
    editMessage,
    deleteMessage,
    startTyping,
    stopTyping
  };
};

// Hook for room management
export const useRooms = (socket, isConnected) => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomEvents, setRoomEvents] = useState([]);

  const createRoom = useCallback((roomName, roomType, maxPlayers, gameSettings) => {
    if (socket && isConnected) {
      socket.emit('create-room', { roomName, roomType, maxPlayers, gameSettings });
    }
  }, [socket, isConnected]);

  const joinRoom = useCallback((roomId) => {
    if (socket && isConnected) {
      socket.emit('join-room', { roomId });
    }
  }, [socket, isConnected]);

  const leaveRoom = useCallback((roomId) => {
    if (socket && isConnected) {
      socket.emit('leave-room', { roomId });
      setCurrentRoom(null);
    }
  }, [socket, isConnected]);

  const getAvailableRooms = useCallback((limit = 20, roomType = 'all') => {
    if (socket && isConnected) {
      socket.emit('get-available-rooms', { limit, roomType });
    }
  }, [socket, isConnected]);

  const toggleReady = useCallback((roomId) => {
    if (socket && isConnected) {
      socket.emit('toggle-ready', { roomId });
    }
  }, [socket, isConnected]);

  const emitGameEvent = useCallback((roomId, eventType, eventData) => {
    if (socket && isConnected) {
      socket.emit('game-event', { roomId, eventType, eventData });
    }
  }, [socket, isConnected]);

  const getRoomDetails = useCallback((roomId) => {
    if (socket && isConnected) {
      socket.emit('get-room-details', { roomId });
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('room-created', (data) => {
      setCurrentRoom(data.room);
      setAvailableRooms(prev => [...prev, data.room]);
    });

    socket.on('room-joined', (data) => {
      setCurrentRoom(data.room);
    });

    socket.on('room-left', (data) => {
      setCurrentRoom(null);
    });

    socket.on('available-rooms', (data) => {
      setAvailableRooms(data.rooms);
    });

    socket.on('room-details', (data) => {
      setCurrentRoom(data.room);
    });

    socket.on('user-joined-room', (data) => {
      if (currentRoom && currentRoom.id === data.roomId) {
        setCurrentRoom(prev => ({
          ...prev,
          currentPlayers: data.currentPlayers,
          participants: [...prev.participants, data.userId],
          participantDetails: [...prev.participantDetails, {
            userId: data.userId,
            username: data.username,
            joinedAt: new Date(),
            isReady: false,
            score: 0
          }]
        }));
      }
    });

    socket.on('user-left-room', (data) => {
      if (currentRoom && currentRoom.id === data.roomId) {
        setCurrentRoom(prev => ({
          ...prev,
          currentPlayers: prev.currentPlayers - 1,
          participants: prev.participants.filter(id => id !== data.userId),
          participantDetails: prev.participantDetails.filter(p => p.userId !== data.userId)
        }));
      }
    });

    socket.on('game-event-received', (event) => {
      setRoomEvents(prev => [...prev, event]);
    });

    socket.on('game-started', (data) => {
      if (currentRoom && currentRoom.id === data.roomId) {
        setCurrentRoom(prev => ({ ...prev, status: 'playing' }));
      }
    });

    socket.on('game-finished', (data) => {
      if (currentRoom && currentRoom.id === data.roomId) {
        setCurrentRoom(prev => ({ ...prev, status: 'finished' }));
      }
    });

    return () => {
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('room-left');
      socket.off('available-rooms');
      socket.off('room-details');
      socket.off('user-joined-room');
      socket.off('user-left-room');
      socket.off('game-event-received');
      socket.off('game-started');
      socket.off('game-finished');
    };
  }, [socket, isConnected, currentRoom]);

  return {
    availableRooms,
    currentRoom,
    roomEvents,
    createRoom,
    joinRoom,
    leaveRoom,
    getAvailableRooms,
    toggleReady,
    emitGameEvent,
    getRoomDetails
  };
};

// Hook for leaderboard functionality
export const useLeaderboard = (socket, isConnected) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myPosition, setMyPosition] = useState(null);
  const [leaderboardStats, setLeaderboardStats] = useState({});

  const updateScore = useCallback((points, reason, gameType) => {
    if (socket && isConnected) {
      socket.emit('update-score', { points, reason, gameType });
    }
  }, [socket, isConnected]);

  const getLeaderboard = useCallback((options = {}) => {
    console.log(options)
    if (socket && isConnected) {
      socket.emit('get-leaderboard', options);
    }
  }, [socket, isConnected]);

  const getMyPosition = useCallback((gameType) => {
    if (socket && isConnected) {
      socket.emit('get-my-position', { gameType });
    }
  }, [socket, isConnected]);

  const recordGameResult = useCallback((result, roomId, finalScore, gameType) => {
    if (socket && isConnected) {
      socket.emit('record-game-result', { result, roomId, finalScore, gameType });
    }
  }, [socket, isConnected]);

  const getLeaderboardStats = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('get-leaderboard-stats');
    }
  }, [socket, isConnected]);

  const subscribeToUpdates = useCallback((gameType) => {
    if (socket && isConnected) {
      socket.emit('subscribe-leaderboard-updates', { gameType });
    }
  }, [socket, isConnected]);

  const unsubscribeFromUpdates = useCallback((gameType) => {
    if (socket && isConnected) {
      socket.emit('unsubscribe-leaderboard-updates', { gameType });
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('leaderboard-data', (data) => {
      setLeaderboard(data.leaderboard);
    });

    socket.on('my-position', (data) => {
      setMyPosition(data);
    });

    socket.on('leaderboard-stats', (data) => {
      setLeaderboardStats(data);
    });

    socket.on('score-updated', (data) => {
      // Update leaderboard if it's currently displayed
      setLeaderboard(prev => {
        const existingIndex = prev.findIndex(entry => entry.userId === data.userId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            totalScore: data.totalScore
          };
          return updated.sort((a, b) => b.totalScore - a.totalScore);
        }
        return prev;
      });
    });

    return () => {
      socket.off('leaderboard-data');
      socket.off('my-position');
      socket.off('leaderboard-stats');
      socket.off('score-updated');
    };
  }, [socket, isConnected]);

  return {
    leaderboard,
    myPosition,
    leaderboardStats,
    updateScore,
    getLeaderboard,
    getMyPosition,
    recordGameResult,
    getLeaderboardStats,
    subscribeToUpdates,
    unsubscribeFromUpdates
  };
};


// Hook for chat functionality
export const useFriends = (socket, isConnected) => {
  const [friendList, setFriendList] = useState([]);

  const sendFriendRequest = useCallback((targetId) => {
    if (socket && isConnected) {
      socket.emit('send-friend-request', { targetUserId: targetId });
    }
  }, [socket, isConnected]);

  const acceptFriendRequest = useCallback((targetId) => {
    if (socket && isConnected) {
      socket.emit('accept-friend-request', { targetUserId: targetId });
    }
  }, [socket, isConnected]);

  const removeFriend = useCallback((targetId) => {
    if (socket && isConnected) {
      socket.emit('remove-friend', { targetUserId: targetId });
    }
  }, [socket, isConnected]);

  const getFriends = useCallback(() => {
    console.log('getFriends')
    if (socket && isConnected) {
      socket.emit('get-friends');
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (!socket || !isConnected) return;
    
    socket.on('friend-list', (friendList) => {
      setFriendList(friendList);
    });
    return () => {
      socket.off('friend-list');
    };
  }, [socket, isConnected]);

  return {
    friendList,
    getFriends,
    removeFriend,
    acceptFriendRequest,
    sendFriendRequest
  };
};
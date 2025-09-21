"use client";
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  deleteDoc,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useMatchmaking(userId) {
  const [isSearching, setIsSearching] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [gameRoom, setGameRoom] = useState(null);

  useEffect(() => {
    if (!userId) return;

    // Listen for game rooms where user is a participant
    const roomsQuery = query(
      collection(db, 'gameRooms'),
      where('players', 'array-contains', userId)
    );

    const unsubscribe = onSnapshot(roomsQuery, (snapshot) => {
      const rooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const activeRoom = rooms.find(room => room.status === 'active' || room.status === 'waiting');
      setGameRoom(activeRoom);
      
      if (activeRoom && activeRoom.status === 'active') {
        setIsSearching(false);
        setCurrentMatch(activeRoom);
      }
    });

    return unsubscribe;
  }, [userId]);

  const findMatch = async () => {
    try {
      setIsSearching(true);

      // Look for existing matchmaking requests
      const matchmakingQuery = query(
        collection(db, 'matchmaking'),
        where('status', '==', 'waiting')
      );

      const matchmakingSnapshot = await getDocs(matchmakingQuery);

      if (!matchmakingSnapshot.empty) {
        // Found someone waiting, create a game room
        const waitingPlayer = matchmakingSnapshot.docs[0];
        const waitingPlayerData = waitingPlayer.data();

        // Create game room
        const gameRoomRef = await addDoc(collection(db, 'gameRooms'), {
          players: [waitingPlayerData.userId, userId],
          status: 'active',
          createdAt: Date.now(),
          currentQuestion: 0,
          quiz: generateQuiz(),
          scores: {
            [waitingPlayerData.userId]: 0,
            [userId]: 0
          },
          answers: {}
        });

        // Remove matchmaking requests
        await deleteDoc(waitingPlayer.ref);
        
        setIsSearching(false);
      } else {
        // No one waiting, add to matchmaking queue
        await addDoc(collection(db, 'matchmaking'), {
          userId,
          status: 'waiting',
          createdAt: Date.now()
        });
      }
    } catch (error) {
      console.error('Error finding match:', error);
      setIsSearching(false);
    }
  };

  const cancelSearch = async () => {
    try {
      const matchmakingQuery = query(
        collection(db, 'matchmaking'),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(matchmakingQuery);
      snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setIsSearching(false);
    } catch (error) {
      console.error('Error canceling search:', error);
    }
  };

  return {
    isSearching,
    currentMatch,
    gameRoom,
    findMatch,
    cancelSearch
  };
}
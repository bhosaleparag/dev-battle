"use client";
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useFriends(userId) {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Listen to accepted friends
    const friendsQuery = query(
      collection(db, 'friends'),
      where('users', 'array-contains', userId),
      where('status', '==', 'accepted')
    );

    const unsubscribeFriends = onSnapshot(friendsQuery, (snapshot) => {
      const friendsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFriends(friendsData);
    });

    // Listen to incoming friend requests
    const requestsQuery = query(
      collection(db, 'friends'),
      where('to', '==', userId),
      where('status', '==', 'pending')
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFriendRequests(requestsData);
    });

    // Listen to sent friend requests
    const sentQuery = query(
      collection(db, 'friends'),
      where('from', '==', userId),
      where('status', '==', 'pending')
    );

    const unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
      const sentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSentRequests(sentData);
    });

    return () => {
      unsubscribeFriends();
      unsubscribeRequests();
      unsubscribeSent();
    };
  }, [userId]);

  const sendFriendRequest = async (toUserId, toUsername) => {
    console.log(toUserId, toUsername)
    try {
      await addDoc(collection(db, 'friends'), {
        from: userId,
        to: toUserId,
        status: 'pending',
        createdAt: Date.now(),
        fromUsername: 'You', // You'd get this from user context
        toUsername: toUsername
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const acceptFriendRequest = async (requestId, fromUserId) => {
    try {
      await updateDoc(doc(db, 'friends', requestId), {
        status: 'accepted',
        users: [userId, fromUserId],
        acceptedAt: Date.now()
      });
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const rejectFriendRequest = async (requestId) => {
    try {
      await deleteDoc(doc(db, 'friends', requestId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return {
    friends,
    friendRequests,
    sentRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest
  };
}
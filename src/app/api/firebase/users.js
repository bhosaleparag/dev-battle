import { doc, getDoc, collection, query, where, getDocs, orderBy, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Function to fetch user details
export const getUserProfile = async (userId) => {
  if (!userId) return null;

  const userRef = doc(db, 'users', userId);
  
  try {
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getFirestoreUsersByIds = async (userIds) => {    
  
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("uid", "in", userIds));

  try {
    const querySnapshot = await getDocs(q);
    
    const usersList = [];
    querySnapshot.forEach((doc) => {usersList.push(doc.data())});
    
    return usersList; // Array of user profile objects
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    return [];
  }
}

export const searchUsers = async (searchTerm, friends = []) => {
  if (!searchTerm || typeof searchTerm !== 'string') return [];
  
  const usersRef = collection(db, "users");
  const uniqueUsers = new Map();
  const endAtPrefix = searchTerm + '\uf8ff';
  
  const qUsername = query(usersRef, where("username", ">=", searchTerm), where("username", "<=", endAtPrefix), orderBy("username"));
  const qEmail = query(usersRef, where("email", ">=", searchTerm), where("email", "<=", endAtPrefix), orderBy("email"));
  
  // Execute both queries in parallel
  const [usernameSnapshot, emailSnapshot] = await Promise.all([getDocs(qUsername), getDocs(qEmail)]);
  
  // Process username results
  usernameSnapshot.forEach(doc => {
    const userData = doc.data();
    if (!friends.includes(userData.uid)) {
      uniqueUsers.set(userData.uid, userData);
    }
  });
  
  // Process email results
  emailSnapshot.forEach(doc => {
    const userData = doc.data();
    if (!friends.includes(userData.uid)) {
      uniqueUsers.set(userData.uid, userData);
    }
  });

  return Array.from(uniqueUsers.values());
}
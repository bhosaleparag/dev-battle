import { createUserWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, collection, query, where, getDocs, getDoc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { getUserProfile } from "@/api/firebase/users";

export const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userDetails = await getUserProfile(user.uid)

    // If the document does NOT exist, create a new profile
    if (!userDetails) {
      await createUserProfile(user);
    }
    
    // Return the successful result regardless of whether a new profile was created
    return { success: true, userDetails };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const handleLogin = async (prevstate, queryData) => {
  const email = queryData.get('email')
  const password = queryData.get('password')
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDetails = await getUserProfile(user.uid)
    return {success: true, userDetails }
  } catch (error) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      return {success: false, message: "Invalid email or password. Please try again."};
    } else {
      return {success: false, message: "An unexpected error occurred. Please try again later."};
    }
  }
};

export async function checkUsernameExists(username, userId) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    const usernameTaken = querySnapshot.docs.some((doc) => doc.id !== userId);
    return usernameTaken;
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
}

export async function handleRegister(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');
  const username = formData.get('username');

  // Username validation
  if (!username || username.trim().length === 0) {
    return { success: false, message: "Username is required." };
  } else if (username.length < 3) {
    return { success: false, message: "Username must be at least 3 characters long." };
  } else if (username.length > 20) {
    return { success: false, message: "Username must be less than 20 characters." };
  } else if (/\s/.test(username)) {
    return { success: false, message: "Username cannot contain spaces." };
  } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { success: false, message: "Username can only contain letters, numbers, underscore and hyphen." };
  } else if (/^[0-9]/.test(username)) {
    return { success: false, message: "Username cannot start with a number." };
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match." };
  } else if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters long." };
  }

  try {
    // Check if username already exists in Firestore
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      return { success: false, message: "Username is already taken. Please choose another." };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userDetails = await createUserProfile(userCredential?.user, username);
    return { success: true, userDetails };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      return { success: false, message: 'Your account already register. Please try to login' };
    } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      return { success: false, message: "Invalid email or password. Please try again." };
    } else if (error.code === 'auth/weak-password') {
      return { success: false, message: "Password is too weak. Use a stronger password." };
    } else {
      return { success: false, message: "An unexpected error occurred. Please try again later." };
    }
  }
}

function generateUsername(name) {
  const base = name.toLowerCase().replace(/\s+/g, '');
  const random = Math.floor(Math.random() * 1000);
  return `${base}${random}`;
}

// Function to create a new user document
export const createUserProfile = async (userAuth, additionalData) => {
  if (!userAuth) return;

  // Create a reference to the new user document using their uid
  const userRef = doc(db, 'users', userAuth.uid);

  // Define the user data structure
  const userProfileData = {
    uid: userAuth.uid,
    username: generateUsername(userAuth.displayName) || null,
    email: userAuth.email,
    avatar: userAuth.photoURL,
    bio: '',
    lastSeen: new Date(),
    stats: {
      quizzesTaken: 0,
      battlesWon: 0,
      streak: 0,
      xp: 0
    },
    ...additionalData, // For any extra data you might want to add during signup
  };

  try {
    await setDoc(userRef, userProfileData, { merge: true }); // `merge: true` ensures existing fields aren't overwritten
    return userProfileData
  } catch (error) {
    return null
  }
};

export async function handleForgotPassword(prevState, formData) {
  const email = formData.get('email');

  // Email validation
  if (!email || email.trim().length === 0) {
    return { success: false, message: "Email is required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    await sendPasswordResetEmail(auth, email, {
      url: `${baseUrl}/login`,
      handleCodeInApp: false,
    });

    return { 
      success: true, 
      message: "Password reset email sent! Please check your inbox and spam folder." 
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    
    if (error.code === 'auth/user-not-found') {
      // For security, don't reveal if email exists
      return { 
        success: true, 
        message: "If this email exists, a password reset link has been sent." 
      };
    } else if (error.code === 'auth/invalid-email') {
      return { success: false, message: "Invalid email address." };
    } else if (error.code === 'auth/too-many-requests') {
      return { success: false, message: "Too many requests. Please try again later." };
    } else {
      return { success: false, message: "Failed to send reset email. Please try again." };
    }
  }
}

export async function downloadUserData(userId) {
  try {
    // Fetch all data in parallel using Promise.all for better performance
    const [
      userDoc,
      battleSnapshot,
      achievementSnapshot,
      friendsSnapshot
    ] = await Promise.all([
      getDoc(doc(db, 'users', userId)),
      getDocs(query(collection(db, 'gameResults'), where('participants', 'array-contains', userId))),
      getDocs(query(collection(db, 'achievements'), where('userId', '==', userId))),
      getDoc(doc(db, 'userFriends', userId))
    ]);
    if (!userDoc.exists()) {
      return { success: false, message: 'User not found.' };
    }

    const userData = userDoc.data();

    // Process user progress data
    const userProgress = userData.userprogress || {
      totalXP: 0,
      challenges: {},
      stats: {
        challengesCompleted: 0,
        quizzesCompleted: 0,
        debuggersCompleted: 0
      }
    };

    // Organize challenges by type
    const challengesByType = {
      challenges: [],
      quizzes: [],
      debuggers: []
    };

    Object.entries(userProgress.challenges || {}).forEach(([id, data]) => {
      const challenge = { id, ...data };
      if (data.type === 'challenge') {
        challengesByType.challenges.push(challenge);
      } else if (data.type === 'quiz') {
        challengesByType.quizzes.push(challenge);
      } else if (data.type === 'debuggerChallenge') {
        challengesByType.debuggers.push(challenge);
      }
    });

    // Map data from snapshots
    const battleData = battleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const achievementData = achievementSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    let friendsData = [];
    if (friendsSnapshot.exists()) {
      const friendsObj = friendsSnapshot.data();
      friendsData = Object.entries(friendsObj).map(([id, data]) => ({
        id,
        ...data
      }));
    }
    // Calculate additional statistics
    const stats = {
      totalXP: userProgress.totalXP,
      challengesCompleted: userProgress.stats.challengesCompleted,
      quizzesCompleted: userProgress.stats.quizzesCompleted,
      debuggersCompleted: userProgress.stats.debuggersCompleted,
      totalBattles: battleData.length,
      totalAchievements: achievementData.length,
      totalFriends: friendsData.length,
      accountAge: userData.createdAt ? 
        Math.floor((Date.now() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0
    };

    // Combine all data with organized structure
    const allData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        dataVersion: '1.0',
        userId: userId
      },
      profile: {
        uid: userData.uid,
        email: userData.email,
        username: userData.username,
        displayName: userData.displayName,
        createdAt: userData.createdAt,
        isActive: userData.isActive
      },
      progress: {
        totalXP: userProgress.totalXP,
        stats: userProgress.stats,
        challengesByType: challengesByType
      },
      statistics: stats,
      battleHistory: battleData,
      achievements: achievementData,
      friends: friendsData
    };

    // Convert to JSON string with pretty formatting
    const jsonData = JSON.stringify(allData, null, 2);
    
    return { 
      success: true, 
      data: jsonData,
      message: 'Data exported successfully!' 
    };
  } catch (error) {
    console.error('Download data error:', error);
    return { success: false, message: 'Failed to export data. Please try again.' };
  }
}

// Deactivate Account
export async function deactivateAccount(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      isActive: false,
      deactivatedAt: new Date().toISOString(),
      status: 'deactivated'
    });
    
    return { 
      success: true, 
      message: 'Account deactivated successfully. You can reactivate it anytime by logging in.' 
    };
  } catch (error) {
    console.error('Deactivate account error:', error);
    return { success: false, message: 'Failed to deactivate account. Please try again.' };
  }
}

// Reactivate Account (when user logs in again)
export async function reactivateAccount(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      isActive: true,
      deactivatedAt: null,
      reactivatedAt: new Date().toISOString(),
      status: 'active'
    });

    return { success: true, message: 'Account reactivated successfully!' };
  } catch (error) {
    console.error('Reactivate account error:', error);
    return { success: false, message: 'Failed to reactivate account.' };
  }
}

// Delete Account (Permanent)
export async function deleteAccount(userId, password) {
  try {
    // Use Firestore batch for atomic operations
    const batch = writeBatch(db);

    // Delete user profile
    const userRef = doc(db, 'users', userId);
    batch.delete(userRef);

    // Fetch all related data in parallel
    const [
      achievementSnapshot,
      friendsSnapshot,
      battleSnapshot
    ] = await Promise.all([
      getDocs(query(collection(db, 'achievements'), where('userId', '==', userId))),
      getDocs(collection(db, 'userFriends', userId)),
      getDocs(query(collection(db, 'gameResults'), where('participants', 'array-contains', userId)))
    ]);

    // Add all deletions to batch
    achievementSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    friendsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    
    // For battles, update to remove user from participants instead of deleting
    // (to preserve other participants' data)
    battleSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const updatedParticipants = data.participants.filter(id => id !== userId);
      
      if (updatedParticipants.length > 0) {
        // Update battle with removed participant
        batch.update(doc.ref, { 
          participants: updatedParticipants,
          deletedParticipants: [...(data.deletedParticipants || []), userId]
        });
      } else {
        // Delete battle if no participants left
        batch.delete(doc.ref);
      }
    });

    // Commit all deletions in a single batch operation
    await batch.commit();

    // Note: Firebase Auth user deletion happens on client side for security
    return { 
      success: true, 
      message: 'Account and all data deleted successfully.' 
    };
  } catch (error) {
    console.error('Delete account error:', error);
    return { success: false, message: 'Failed to delete account. Please try again.' };
  }
}
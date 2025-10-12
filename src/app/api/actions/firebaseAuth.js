import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
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
    console.log('first user login success')
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

export async function handleRegister(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  // Check if passwords match
  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match." };
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userDetails = await createUserProfile(userCredential?.user)
    return { success: true, userDetails };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use'){
      return { success: false, message: 'Your account already register. Please try to login' };
    } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      return {success: false, message: "Invalid email or password. Please try again."};
    } else {
      return {success: false, message: "An unexpected error occurred. Please try again later."};
    }
  }
}

// Function to create a new user document
export const createUserProfile = async (userAuth, additionalData) => {
  if (!userAuth) return;

  // Create a reference to the new user document using their uid
  const userRef = doc(db, 'users', userAuth.uid);

  // Define the user data structure
  const userProfileData = {
    uid: userAuth.uid,
    username: userAuth.displayName || null,
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
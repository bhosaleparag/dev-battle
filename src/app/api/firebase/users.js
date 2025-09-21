import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Function to fetch user details
export const getUserProfile = async (userId) => {
  if (!userId) return null;

  const userRef = doc(db, 'users', userId);
  
  try {
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      // The document exists, so return its data
      return userSnapshot.data();
    } else {
      // The document does not exist
      return null;
    }
  } catch (error) {
    return null;
  }
};


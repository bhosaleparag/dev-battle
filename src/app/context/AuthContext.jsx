"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { getUserProfile } from "@/api/firebase/users";
import Loader from "@/loading";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          const sessionResponse = await fetch("/api/auth/session", {
            method: "POST",
            headers: {
              authorization: `Bearer ${token}`,
            },
          });

          if (!sessionResponse.ok) {
            throw new Error("Failed to create session");
          }

          // Fetch user profile
          const userData = await getUserProfile(firebaseUser.uid);
          setUser(userData);
          
        } else {
          // User logged out
          await fetch("/api/auth/session", { method: "DELETE" });
          setUser(null);
        }
      } catch (err) {
        console.error("Auth error:", err);
        
        // Clear session on error
        await fetch("/api/auth/session", { method: "DELETE" });
        setUser(null);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      await fetch("/api/auth/session", { method: "DELETE" });
      setUser(null);
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Show loader only on initial load
  if (!authInitialized) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        setUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
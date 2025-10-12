"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import usePersistedState from "@/hooks/usePersistedState";
import { getUserProfile } from "@/api/firebase/users";
import Loader from "@/loading";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = usePersistedState("user", null);

  useEffect(() => {
    setHydrated(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // fetch user profile
          const userData = await getUserProfile(firebaseUser.uid);
          setUser(userData);

          const token = await firebaseUser.getIdToken();
          await fetch("/api/auth/session", {
            method: "POST",
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
        } catch (err) {
          await fetch("/api/auth/session", { method: "DELETE" });
          console.error("Error fetching user profile:", err);
          setUser(null);
        }
      } else {
        await fetch("/api/auth/session", { method: "DELETE" });
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  if (!hydrated) {
    return <Loader/>
  }
  /// HERE fix presence 
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        setUser,
        signOut: async () => {
          await signOut(auth);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
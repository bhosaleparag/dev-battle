"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import usePersistedState from "@/hooks/usePersistedState";
import Loader from "@/loading";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = usePersistedState("user", null);
  const { data: session, status } = useSession();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/user/${session.user.id}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.error("Failed to fetch user profile");
            setUser(null);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    if (status === "authenticated") {
      fetchUserProfile();
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status, setUser]);

  if (!hydrated || status === "loading") {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        setUser,
        signOut: async () => {
          await nextAuthSignOut({ callbackUrl: "/" });
          setUser(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
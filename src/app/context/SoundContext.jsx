"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { soundManager } from '../lib/sounds/soundManager';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust import path as needed
import useAuth from '@/hooks/useAuth';

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    soundEffects: true,
    backgroundMusic: true,
    vibration: true,
    masterVolume: 0.7
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize sound manager
  useEffect(() => {
    soundManager.init();
  }, []);

  // Sync preferences with Firebase
  useEffect(() => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', user?.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.preferences) {
          const userPrefs = {
            soundEffects: userData.preferences.soundEffects ?? true,
            backgroundMusic: userData.preferences.backgroundMusic ?? true,
            vibration: userData.preferences.vibration ?? true,
            masterVolume: userData.preferences.masterVolume ?? 0.5
          };
          setPreferences(userPrefs);
          soundManager.updatePreferences(userPrefs);
        }
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Error syncing sound preferences:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Update preferences in Firebase
  const updatePreferences = async (newPreferences) => {
    // If no user, just update local state
    setPreferences(prev => ({ ...prev, ...newPreferences }));
    soundManager.updatePreferences({ ...preferences, ...newPreferences });
  };

  const value = {
    preferences,
    updatePreferences,
    isLoading,
    // Convenience methods
    play: (soundName) => soundManager.play(soundName),
    vibrate: (pattern) => soundManager.vibrate(pattern),
    playBackgroundMusic: () => soundManager.playBackgroundMusic(),
    stopBackgroundMusic: () => soundManager.stopBackgroundMusic(),
    pauseBackgroundMusic: () => soundManager.pauseBackgroundMusic(),
    resumeBackgroundMusic: () => soundManager.resumeBackgroundMusic(),
    setMasterVolume: (volume) => {
      soundManager.setMasterVolume(volume);
      updatePreferences({ masterVolume: volume });
    }
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
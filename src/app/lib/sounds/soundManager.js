class SoundManager {
  constructor() {
    this.sounds = {};
    this.backgroundMusic = null;
    this.preferences = {
      soundEffects: true,
      backgroundMusic: true,
      vibration: true,
      masterVolume: 0.7
    };
    this.isInitialized = false;
  }

  // Initialize and preload all sounds
  init() {
    if (this.isInitialized) return;

    // UI Sounds
    this.loadSound('click', '/sounds/ui/click.mp3', 0.5);
    this.loadSound('hover', '/sounds/ui/hover.mp3', 0.3);
    this.loadSound('toggle', '/sounds/ui/toggle.mp3', 0.4);
    this.loadSound('swipe', '/sounds/ui/swipe.mp3', 0.4);

    // Quiz Sounds
    this.loadSound('tick', '/sounds/quiz/tick.mp3', 0.6);
    this.loadSound('correct', '/sounds/quiz/correct.mp3', 0.7);
    this.loadSound('wrong', '/sounds/quiz/wrong.mp3', 0.6);
    this.loadSound('timeout', '/sounds/quiz/timeout.mp3', 0.7);

    // Battle Sounds
    this.loadSound('countdown', '/sounds/battle/countdown.mp3', 0.7);
    this.loadSound('matchFound', '/sounds/battle/match-found.mp3', 0.8);
    this.loadSound('victory', '/sounds/battle/victory.mp3', 0.8);
    this.loadSound('defeat', '/sounds/battle/defeat.mp3', 0.7);
    this.loadSound('battleStart', '/sounds/battle/start.mp3', 0.8);

    // Notification Sounds
    this.loadSound('achievement', '/sounds/notifications/achievement.mp3', 0.8);
    this.loadSound('friendOnline', '/sounds/notifications/friend-online.mp3', 0.5);
    this.loadSound('notification', '/sounds/notifications/notification.mp3', 0.6);
    this.loadSound('levelUp', '/sounds/notifications/level-up.mp3', 0.8);

    // Background Music
    this.loadBackgroundMusic('/sounds/music/background.mp3', 0.3);

    this.isInitialized = true;
  }

  // Load a sound effect
  loadSound(name, path, volume = 0.7) {
    try {
      const audio = new Audio(path);
      audio.volume = volume;
      audio.preload = 'auto';
      this.sounds[name] = { audio, volume };
    } catch (error) {
      console.warn(`Failed to load sound: ${name}`, error);
    }
  }

  // Load background music
  loadBackgroundMusic(path, volume = 0.3) {
    try {
      this.backgroundMusic = new Audio(path);
      this.backgroundMusic.volume = volume;
      this.backgroundMusic.loop = true;
      this.backgroundMusic.preload = 'auto';
    } catch (error) {
      console.warn('Failed to load background music', error);
    }
  }

  // Play a sound effect
  play(soundName) {
    if (!this.preferences.soundEffects) return;
    
    const sound = this.sounds[soundName];
    if (!sound) {
      console.warn(`Sound not found: ${soundName}`);
      return;
    }

    try {
      const audioClone = sound.audio.cloneNode();
      audioClone.volume = sound.volume * this.preferences.masterVolume;
      audioClone.play().catch(err => {
        // Silently handle autoplay restrictions
        console.debug('Audio play prevented:', err);
      });
    } catch (error) {
      console.warn(`Failed to play sound: ${soundName}`, error);
    }
  }

  // Play background music
  playBackgroundMusic() {
    if (!this.preferences.backgroundMusic || !this.backgroundMusic) return;

    try {
      this.backgroundMusic.volume = 0.3 * this.preferences.masterVolume;
      this.backgroundMusic.play().catch(err => {
        console.debug('Background music play prevented:', err);
      });
    } catch (error) {
      console.warn('Failed to play background music', error);
    }
  }

  // Stop background music
  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  // Pause background music
  pauseBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  // Resume background music
  resumeBackgroundMusic() {
    if (this.preferences.backgroundMusic && this.backgroundMusic) {
      this.backgroundMusic.play().catch(err => {
        console.debug('Background music resume prevented:', err);
      });
    }
  }

  // Vibrate device (mobile)
  vibrate(pattern = 50) {
    if (!this.preferences.vibration) return;
    
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  // Update preferences
  updatePreferences(newPreferences) {
    this.preferences = { ...this.preferences, ...newPreferences };

    // Handle background music state
    if (!this.preferences.backgroundMusic && this.backgroundMusic) {
      this.stopBackgroundMusic();
    }
  }

  // Set master volume (0 to 1)
  setMasterVolume(volume) {
    this.preferences.masterVolume = Math.max(0, Math.min(1, volume));
    
    // Update background music volume
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = 0.3 * this.preferences.masterVolume;
    }
  }
}

// Export singleton instance
export const soundManager = new SoundManager();
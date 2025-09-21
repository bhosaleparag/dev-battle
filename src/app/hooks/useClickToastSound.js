// hooks/useClickToastSound.js
import { useCallback, useEffect, useRef } from 'react';

/**
 * useClickToastSound
 * ------------------
 * Usage:
 *   const playToast = useClickToastSound('/click.mp3');
 *   <button onClick={playToast}>Save</button>
 *
 * @param {string} src  – path or URL to an audio file
 * @param {number} volume – 0.0-1.0 (default 1)
 * @returns {() => void}  – handler to trigger the sound
 */
export default function useClickToastSound(src, volume = 1) {
  const audioRef = useRef(null);

  // create the Audio object once
  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.volume = volume;
    audio.preload = 'auto';       // hint browser to cache it
    audioRef.current = audio;
  }, [src, volume]);

  // play() from the same Audio instance each time
  const playToast = useCallback(() => {
    if (!audioRef.current) return;

    // restart from beginning if user triggers rapidly
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      /* browsers block autoplay without user gesture */
    });
  }, []);

  return playToast;
}

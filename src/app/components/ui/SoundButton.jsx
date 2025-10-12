"use client";
import { useSound } from "@/context/SoundContext";

export function SoundButton({ 
  children, 
  onClick, 
  soundEffect = 'click', 
  vibratePattern = 50,
  className = '',
  disabled = false,
  ...props 
}) {
  const { play, vibrate } = useSound();

  const handleClick = (e) => {
    if (disabled) return;
    
    // Play sound and vibrate
    play(soundEffect);
    vibrate(vibratePattern);
    
    // Call original onClick
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

// Example usage in your components:
/*
import { SoundButton } from '@/components/SoundButton';

// Basic usage - plays 'click' sound
<SoundButton onClick={() => console.log('clicked')}>
  Click Me
</SoundButton>

// Custom sound effect
<SoundButton 
  soundEffect="toggle" 
  onClick={handleToggle}
>
  Toggle
</SoundButton>

// Custom vibration pattern (array)
<SoundButton 
  soundEffect="achievement" 
  vibratePattern={[100, 50, 100]}
  onClick={handleAchievement}
>
  Claim Achievement
</SoundButton>
*/
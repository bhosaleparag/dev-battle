"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Celebration({ trigger, duration = 3000 }) {
  useEffect(() => {
    if (!trigger) return;

    const end = Date.now() + duration;

    (function frame() {
      // Left popper
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        startVelocity: 55,
        origin: { x: 0, y: 0.9 },
      });

      // Right popper
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        startVelocity: 55,
        origin: { x: 1, y: 0.9 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [trigger, duration]);

  return null; // nothing visible, just triggers animation
}

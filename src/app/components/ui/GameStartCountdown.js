"use client";
import { useState, useEffect } from "react";
import { Swords } from "lucide-react";

const GameStartCountdown = ({ onComplete, duration = 5 }) => {
  const [count, setCount] = useState(duration);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
      // reset animation flag briefly for pulse effect
      setTimeout(() => setIsAnimating(false), 300);
    }, 1000);

    return () => {
      clearInterval(interval)
    };
  }, []);

  useEffect(()=>{
    if(count === 1){
      onComplete()
    }
  },[count])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="text-center">
        {/* Title */}
        <div className="mb-8">
          <Swords className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Battle Starting...
          </h2>
          <p className="text-gray-300">Get ready to compete!</p>
        </div>

        {/* Countdown Number */}
        <div className="relative h-40 flex items-center justify-center">
          {count > 0 ? (
            <div
              className={`text-9xl font-bold bg-gradient-to-br from-purple-500 to-purple-700 bg-clip-text text-transparent transition-transform duration-300 ${
                isAnimating ? "scale-125" : "scale-100"
              }`}
              style={{ textShadow: "0 0 60px rgba(112, 59, 247, 0.5)"}}
            >
              {count}
            </div>
          ) : (
            <div
              className="text-6xl font-bold text-green-400 animate-pulse"
              style={{textShadow: "0 0 60px rgba(74, 222, 128, 0.5)"}}
            >
              GO!
            </div>
          )}

          {/* Pulse Ring */}
          {count > 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ pointerEvents: "none" }}
            >
              <div
                className={`w-32 h-32 border-4 border-purple-500 rounded-full ${
                  isAnimating ? "animate-ping" : ""
                }`}
              />
            </div>
          )}
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: duration }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                duration - idx > count
                  ? "bg-purple-500 scale-125"
                  : "bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameStartCountdown;

"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Typography from "@/components/ui/Typography";

function StarRating({
  name,
  max = 5,
  defaultValue = 0,
  className = "",
}){
  const [rating, setRating] = useState(defaultValue);
  const [hover, setHover] = useState(0);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Hidden input to submit value in form */}
      <input type="hidden" name={name} value={rating} />
      <Typography className='mr-10'>Rating</Typography>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <Star
              size={24}
              className={`${
                starValue <= (hover || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;

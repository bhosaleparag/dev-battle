"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { SoundButton } from "@/components/ui/SoundButton";

function StarRating({ name, value, max=5, onChange, error }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white-90">
        Rating <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <SoundButton
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-all duration-200 hover:scale-110"
          >
            <Star
              size={32}
              className={`transition-colors ${
                star <= (hover || value)
                  ? 'fill-purple-60 text-purple-60'
                  : 'text-gray-40'
              }`}
            />
          </SoundButton>
        ))}
        <span className="ml-2 text-white-90 self-center">
          {value > 0 && `${value}/5`}
        </span>
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

export default StarRating;

// src/components/StartRating/StarRating.jsx
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function StarRatingSelector({
  rating = 0,
  setRating,
  maxStars = 5,
  readOnly = false,
  size = "md",
  className = ""
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const activeRating = hoverRating > 0 ? hoverRating : rating;

  const sizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl"
  }[size] || "text-xl";

  const handleSelect = (starValue) => {
    if (!readOnly && typeof setRating === "function") {
      setRating(starValue);
    }
  };

  const handleKeyDown = (e, starValue) => {
    if (readOnly) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(starValue);
    }
  };

  return (
    <div
      role={readOnly ? "img" : "radiogroup"}
      aria-label={readOnly ? `Rating: ${rating} out of ${maxStars} stars` : "Rating selector"}
      className={`inline-flex items-center gap-1 ${className}`}
      onMouseLeave={() => !readOnly && setHoverRating(0)}
    >
      {[...Array(maxStars)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= activeRating;

        if (readOnly) {
          return (
            <FaStar
              key={i}
              className={`${sizeClasses} ${
                isFilled ? "text-amber-400" : "text-neutral-300 dark:text-neutral-700"
              }`}
              aria-hidden="true"
            />
          );
        }

        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={starValue === rating}
            aria-label={`${starValue} out of ${maxStars} stars`}
            className={`p-0.5 rounded transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${sizeClasses}`}
            onClick={() => handleSelect(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onKeyDown={(e) => handleKeyDown(e, starValue)}
          >
            <FaStar
              className={`transition-colors ${
                isFilled ? "text-amber-400" : "text-neutral-300 dark:text-neutral-700 hover:text-amber-300"
              }`}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

// Named alias for convenience
export { StarRatingSelector as StarRating };

// src/components/Loarding/LoadingSpinner.jsx
import React from 'react';

export default function LoadingSpinner({
  message = "Preparing your experience",
  subtext = "Soft Game Studio",
  fullScreen = true
}) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 grid min-h-[100svh] place-items-center overflow-hidden bg-neutral-950 px-6 text-white"
    : "py-12 px-6 flex flex-col items-center justify-center text-center text-neutral-900 dark:text-white";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={containerClasses}
    >
      {fullScreen && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(0,172,240,0.12),transparent_60%)]"
        />
      )}

      <div className="relative flex flex-col items-center text-center">
        {/* Animated brand spinner */}
        <div className="relative mb-6 flex items-center justify-center">
          <svg
            aria-hidden="true"
            className="h-10 w-10 animate-spin text-[#00ACF0] motion-reduce:animate-none"
            viewBox="0 0 40 40"
            fill="none"
          >
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth="3.5"
            />
            <path
              d="M20 4a16 16 0 0 1 16 16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="3.5"
            />
          </svg>
        </div>

        <p className="text-lg sm:text-xl font-bold tracking-tight text-white dark:text-white">
          {subtext}
        </p>
        <p className="mt-1.5 text-xs sm:text-sm text-neutral-400">
          {message}
        </p>
      </div>

      <span className="sr-only">Loading content</span>
    </div>
  );
}

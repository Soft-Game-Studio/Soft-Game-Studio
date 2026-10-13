export default function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-50 grid min-h-[100svh] place-items-center overflow-hidden bg-neutral-950 px-6 text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(0,172,240,0.12),transparent_55%)]"
      />

      <div className="relative flex flex-col items-center text-center">
        <svg
          aria-hidden="true"
          className="mb-7 h-10 w-10 animate-spin text-brand motion-reduce:animate-none"
          viewBox="0 0 40 40"
          fill="none"
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth="3"
          />
          <path
            d="M20 4a16 16 0 0 1 16 16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>

        <p className="text-xl font-semibold tracking-tight sm:text-2xl">
          Soft Game Studio
        </p>
        <p className="mt-2 text-sm text-neutral-400">Preparing your experience</p>
      </div>

      <span className="sr-only">Loading</span>
    </div>
  );
}

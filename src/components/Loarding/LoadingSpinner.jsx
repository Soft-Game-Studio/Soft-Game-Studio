import React, { useEffect, useState } from "react";

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [icons, setIcons] = useState([]);

  // Generate floating icons with random positions and animations
  useEffect(() => {
    const techIcons = [
      "🤖", "5G", "AI", "⚛️", "🌐", "🛜", "📡", "⚡", "🧠",
      "💻", "🔮", "💡", "📊", "🖥️", "☁️", "🔒", "📱", "🎮"
    ];

    const newIcons = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      icon: techIcons[i % techIcons.length],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}rem`,
      duration: `${Math.random() * 15 + 8}s`,
      delay: `${Math.random() * 5}s`,
      rotate: `${Math.random() * 360}deg`
    }));
    setIcons(newIcons);
  }, []);

  // Progress simulation
  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 15;
      if (value >= 100) {
        value = 100;
        clearInterval(interval);
        setTimeout(() => {
          onFinish(); // trigger website open
        }, 500);
      }
      setProgress(Math.floor(value));
    }, 200);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-950 via-black to-neutral-900 transition-all duration-500">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Floating icons */}
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute pointer-events-none select-none text-white/20 dark:text-white/10 will-change-transform"
          style={{
            left: icon.left,
            top: icon.top,
            fontSize: icon.size,
            transform: `rotate(${icon.rotate})`,
            animation: `float ${icon.duration} infinite ease-in-out`,
            animationDelay: icon.delay,
          }}
        >
          {icon.icon}
        </div>
      ))}

      {/* Radial vignette overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* Logo / Name */}
        <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-white to-indigo-300 tracking-wide mb-3 animate-pulse">
          Soft Game Studio
        </h1>

        {/* Tagline */}
        <p className="text-purple-200/80 dark:text-neutral-400 text-sm mb-8 tracking-wider">
          Building Digital Experiences
        </p>

        {/* Progress bar container */}
        <div className="w-64 md:w-80 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20 shadow-lg shadow-purple-500/20">
          <div
            className="h-full bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percent text */}
        <p className="mt-4 text-white/70 text-sm font-mono tracking-wider">
          {progress}%
        </p>
      </div>

      {/* Inline keyframe animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}
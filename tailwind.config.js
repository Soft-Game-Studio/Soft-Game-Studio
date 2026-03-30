/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ required for toggle
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: "#00ACF0",
        'sgs-dark':    '#0B0F19',
        'sgs-navy':    '#0D1117',
        'sgs-primary': '#7C3AED',
        'sgs-accent':  '#22D3EE',
        'sgs-card':    'rgba(255,255,255,0.05)',
      },
      boxShadow: {
        glow:        '0 0 60px rgba(168,85,247,0.35)',
        'glow-cyan': '0 0 40px rgba(34,211,238,0.25)',
        'card':      '0 4px 32px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.3), transparent)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-fast': 'floatFast 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'marquee':    'marquee 40s linear infinite',
      },
      keyframes: {
        floatSlow: { '0%,100%': { transform: 'translateY(0px) rotate(0deg)' }, '50%': { transform: 'translateY(-30px) rotate(5deg)' } },
        floatFast: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-18px)' } },
        pulseGlow:  { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        marquee:    { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

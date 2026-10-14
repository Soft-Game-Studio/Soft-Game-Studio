/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // required for theme toggle
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: "#00ACF0", // Soft Game Studio Brand Cyan
          hover:   "#0096D1",
          dark:    "#007CAE",
          light:   "#E0F5FE",
        },
        'sgs-dark':    '#0A0A0A',
        'sgs-navy':    '#121212',
        'sgs-primary': '#00ACF0', // Unified brand cyan (zero purple)
        'sgs-accent':  '#38BDF8',
        'sgs-card':    'rgba(255,255,255,0.05)',
      },
      boxShadow: {
        glow:        '0 0 50px rgba(0,172,240,0.22)',
        'glow-cyan': '0 0 40px rgba(0,172,240,0.25)',
        'card':      '0 4px 32px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,172,240,0.12), transparent)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-fast': 'floatFast 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'marquee':    'marquee 40s linear infinite',
      },
      keyframes: {
        floatSlow: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-16px)' } },
        floatFast: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseGlow:  { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        marquee:    { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

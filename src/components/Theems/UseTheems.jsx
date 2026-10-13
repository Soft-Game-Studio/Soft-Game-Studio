import { useEffect, useState, useCallback } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  // Keep DOM classList and localStorage synchronized with theme state
  useEffect(() => {
    if (typeof document === "undefined") return;
    const active = theme === "dark" ? "dark" : "light";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(active);
    try {
      localStorage.setItem("theme", active);
    } catch {
      // localStorage may fail in private mode
    }
  }, [theme]);

  // Robust toggleTheme supporting functional updater, explicit value, or no args
  const toggleTheme = useCallback((targetTheme) => {
    setTheme((prev) => {
      let nextTheme;
      if (typeof targetTheme === "function") {
        nextTheme = targetTheme(prev);
      } else if (targetTheme === "dark" || targetTheme === "light") {
        nextTheme = targetTheme;
      } else {
        nextTheme = prev === "dark" ? "light" : "dark";
      }
      return nextTheme === "dark" ? "dark" : "light";
    });
  }, []);

  return {
    theme,
    setTheme: toggleTheme,
    toggleTheme,
  };
}

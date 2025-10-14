import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Tailwind class-based theme selector with explicit Light/Dark buttons
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);

  // Initialize theme on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored ? stored === "dark" : prefersDark;

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const setTheme = (mode: "light" | "dark") => {
    const dark = mode === "dark";
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", mode);
  };

  return (
    <div className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-xl border border-emerald-900/15 dark:border-white/15 bg-emerald-900/5 dark:bg-white/10 backdrop-blur text-emerald-900 dark:text-white px-2 py-1 shadow-md">
      <button
        type="button"
        aria-pressed={!isDark}
        aria-label="Switch to light mode"
        onClick={() => setTheme("light")}
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
          !isDark ? "bg-emerald-900/10" : "hover:bg-white/10"
        }`}
      >
        <Sun className="h-4 w-4" />
        <span className="text-xs">Light</span>
      </button>
      <button
        type="button"
        aria-pressed={isDark}
        aria-label="Switch to dark mode"
        onClick={() => setTheme("dark")}
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
          isDark ? "bg-white/20" : "hover:bg-emerald-900/10"
        }`}
      >
        <Moon className="h-4 w-4" />
        <span className="text-xs">Dark</span>
      </button>
    </div>
  );
}

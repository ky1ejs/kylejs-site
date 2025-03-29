"use client";
import { effectiveThemeForTheme, Theme } from "@/components/Theme/Theme";
import { useTheme } from "@/components/Theme/ThemeProvider";
import { useEffect, useState } from "react";

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const emojiForTheme = (theme: Theme | undefined) => {
    switch (theme) {
      case Theme.Light:
        return "☀️";
      case Theme.Dark:
        return "🌙";
      default:
        return "🖥️";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const themeButton = document.getElementById("theme-button");
      if (themeButton && !themeButton.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        id="theme-button"
        // data-popover-target="popover-user-profile"
        className="rounded-xl bg-background-secondary px-3 py-1 hover:bg-background-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{emojiForTheme(theme)}</span>
      </button>
      {isOpen && (
        <div
          id="popover-user-profile"
          className="absolute -left-20 top-10 w-32 rounded-xl bg-background-secondary text-sm shadow-md transition-all ease-linear dark:shadow-none"
        >
          {Object.values(Theme).map((t) => (
            <button
              key={t}
              className="w-full px-2 py-1 text-left hover:bg-background-primary"
              onClick={() => {
                setTheme(t);
                setIsOpen(false);
              }}
            >
              {emojiForTheme(t)} {t}{" "}
              {t === Theme.System && `(${effectiveThemeForTheme(t)})`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

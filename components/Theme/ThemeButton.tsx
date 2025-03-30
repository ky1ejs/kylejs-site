"use client";
import { effectiveThemeForTheme, Theme } from "@/components/Theme/Theme";
import { useTheme } from "@/components/Theme/ThemeProvider";
import { useEffect, useState } from "react";

const LoadingIndicator = () => (
  <svg
    className="size-5 animate-spin text-muted"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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
    // workaround for Next.js hydration issue with reading theme from cookies
    setIsMounted(true);
  }, []);

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
    <div className="relative flex h-10 w-12 items-center justify-center rounded-xl bg-background-secondary hover:bg-background-200">
      <div
        className={`${isMounted ? "opacity-0" : "opacity-100"} absolute z-10 transition-opacity duration-300`}
      >
        <LoadingIndicator />
      </div>
      {isMounted && (
        <>
          <button
            id="theme-button"
            className="z-20 h-full w-full"
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
        </>
      )}
    </div>
  );
}

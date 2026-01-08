"use client";

import React from "react";
import { useEffect } from "react";
import cookies from "js-cookie";
import {
  EffectiveTheme,
  effectiveThemeForTheme,
  MEDIA_QUERY,
  Theme,
  themeFromString,
} from "@/components/Theme/Theme";

export default function SystemThemeObserver() {
  useEffect(() => {
    // set theme initially
    const theme = readCurrentEffectiveTheme();
    updateDocTheme(theme || EffectiveTheme.Light);

    const mediaQuery = window.matchMedia(MEDIA_QUERY);
    const handleChange = () => {
      if (readCurrentSetTheme() === Theme.System) {
        readAndApplyTheme();
      }
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return null;
}

function readAndApplyTheme() {
  const theme = readCurrentEffectiveTheme();
  if (theme) {
    updateDocTheme(theme);
  }
}

function readCurrentSetTheme(): Theme | undefined {
  let theme: Theme | undefined;
  if (typeof window !== "undefined") {
    const themeString = cookies.get("theme");
    theme = themeFromString(themeString);
  }
  return theme;
}

function readCurrentEffectiveTheme(): EffectiveTheme | undefined {
  const chosenTheme = readCurrentSetTheme();
  return effectiveThemeForTheme(chosenTheme);
}

function storeTheme(theme: Theme) {
  cookies.set("theme", theme);
  const effectiveTheme = effectiveThemeForTheme(theme);
  if (effectiveTheme) {
    updateDocTheme(effectiveTheme);
  }
}

function updateDocTheme(theme: EffectiveTheme) {
  document.documentElement.setAttribute("data-theme", theme);
}

// Create react context for theme and allow theme to be updated
export const ThemeContext = React.createContext({
  theme: readCurrentSetTheme(),

  setTheme: (_theme: Theme) => {},
});

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProviderWrapper = ({
  children,
  initialValue,
}: {
  children: React.ReactNode;
  initialValue?: Theme;
}) => {
  const [theme, setTheme] = React.useState(
    initialValue ?? readCurrentSetTheme(),
  );

  const st = (theme: Theme) => {
    setTheme(theme);
    storeTheme(theme);
  };

  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme: st }}>
        {children}
      </ThemeContext.Provider>
      <SystemThemeObserver />
    </>
  );
};

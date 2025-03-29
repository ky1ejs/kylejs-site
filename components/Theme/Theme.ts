export enum Theme {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export enum EffectiveTheme {
  Light = "light",
  Dark = "dark",
}

export const MEDIA_QUERY = "(prefers-color-scheme: dark)";

export function readBrowserTheme(): EffectiveTheme {
  if (typeof window === "undefined") return EffectiveTheme.Light;
  return window.matchMedia(MEDIA_QUERY).matches
    ? EffectiveTheme.Dark
    : EffectiveTheme.Light;
}

export function effectiveThemeForTheme(
  theme: Theme | undefined,
): EffectiveTheme | undefined {
  switch (theme) {
    case Theme.Dark:
      return EffectiveTheme.Dark;
    case Theme.Light:
      return EffectiveTheme.Light;
    default:
      if (typeof window !== "undefined") {
        return readBrowserTheme();
      }
      return undefined;
  }
}

export function themeFromString(themeString?: string): Theme | undefined {
  let theme: Theme | undefined;
  const themeValues = Object.values(Theme);
  const themeIndex = themeValues.indexOf(themeString as Theme);
  if (themeIndex !== -1) {
    theme = themeValues[themeIndex] as Theme;
  }
  return theme;
}

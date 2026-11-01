import type { Decorator, Preview } from "@storybook/react-vite";
import "@fontsource-variable/lexend";
import "@fontsource-variable/jetbrains-mono";
import "../src/design/tokens.css";
import "../src/design/components.css";
import "../src/design/prose.css";
import "./preview.css";

type ThemeOption = "both" | "light" | "dark";

// "both" renders the story twice, light then dark, so a single screenshot
// covers both themes
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme ?? "both") as ThemeOption;
  const themes = theme === "both" ? (["light", "dark"] as const) : [theme];
  const layout = context.parameters.themeLayout === "stack" ? "stack" : "row";
  return (
    <div className="sb-themes" data-layout={layout}>
      {themes.map((t) => (
        <div key={t} className="sb-theme" data-theme={t}>
          <Story />
        </div>
      ))}
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "both", title: "Light and dark" },
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "both" },
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
    controls: { expanded: true },
  },
};

export default preview;

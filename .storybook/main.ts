import type { StorybookConfig } from "@storybook/react-vite";

// Storybook for the design system in src/design. It builds the React
// components with its own Vite config, so nothing from astro.config.mjs
// (Tailwind, Sätteri, Astro's integrations) is involved.
const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/design/**/*.mdx", "../src/design/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  core: { disableTelemetry: true },
};

export default config;

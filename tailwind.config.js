/** @type {import('tailwindcss').Config} */
const colorSteps = [50,100,200,300,400,500,600,700,800,900,950];

function makeColorScale(prefix) {
  return Object.fromEntries(
    colorSteps.map(step => [step, `var(--${prefix}-${step})`])
  );
}

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./posts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'], // Add support for data-theme
  theme: {
    screens: {
      sm: "460px",
    },
    extend: {
      colors: {
        muted: 'var(--muted)',
        text: makeColorScale('text'),
        background: {
          primary: 'var(--background-primary)',
          secondary: 'var(--background-secondary)',
          ...makeColorScale('background'),
        },
        primary: {
          DEFAULT: 'var(--primary)',
          ...makeColorScale('primary'),
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          ...makeColorScale('secondary'),
        },
        accent: makeColorScale('accent'),
      },
    },
  },
  plugins: [],
};

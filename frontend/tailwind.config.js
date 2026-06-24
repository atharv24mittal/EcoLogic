/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        g: "#00E87A",
        gbright: "#1FFFA0",
        bg: "#040C08",
        bg2: "#071A0F",
        card: "#0B1C12",
        card2: "#0E2216",
        sidebar: "#020706",
        border: "rgba(0,232,122,0.13)",
        border2: "rgba(0,232,122,0.24)",
        muted: "#7FAD8F",
        dim: "#3D6B50",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        blink: "blink 2s infinite",
        fadeUp: "fadeUp 0.25s ease forwards",
        pulse2: "pulse2 2s infinite",
      },
      keyframes: {
        blink: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.2 } },
        fadeUp: { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        pulse2: { "0%,100%": { boxShadow: "0 0 0 0 rgba(0,232,122,.4)" }, "50%": { boxShadow: "0 0 0 7px rgba(0,232,122,0)" } },
      },
    },
  },
  plugins: [],
};

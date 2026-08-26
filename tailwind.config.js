/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F3D2A",
          50: "#EAF6EF",
          100: "#CDEBDA",
          200: "#9BD7B5",
          300: "#5CB98A",
          400: "#237A4E",
          500: "#155C3B",
          600: "#0F3D2A",
          700: "#0B2E20",
          800: "#082116",
          900: "#04140D",
        },
        paper: {
          DEFAULT: "#F5F7F4",
          light: "#FFFFFF",
          dark: "#E7EBE4",
        },
        brand: {
          DEFAULT: "#1E9E5A",
          light: "#E7F7EE",
          dark: "#146B3D",
        },
        amber: {
          DEFAULT: "#F2A93B",
          light: "#FEF0DA",
          dark: "#D97F0C",
        },
        pass: {
          DEFAULT: "#1F8A5F",
          light: "#DCF0E5",
        },
        alert: {
          DEFAULT: "#E1523D",
          light: "#FBE1DC",
        },
        slate2: "#5B6478",
      },
      fontFamily: {
        display: ["Zilla Slab", "serif"],
        body: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "dot-grid": "radial-gradient(circle, #13234714 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-grid": "16px 16px",
      },
    },
  },
  plugins: [],
};

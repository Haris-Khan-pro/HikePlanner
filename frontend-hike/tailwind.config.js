/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2ECC71", // Nature green
          light: "#58D68D",
          dark: "#27AE60",
        },
        secondary: {
          DEFAULT: "#3498DB", // Sky blue
          light: "#5DADE2",
          dark: "#2874A6",
        },
        background: {
          DEFAULT: "#121212", // dark background (kept same)
          light: "#181818",   // (kept same)
          lighter: "#282828", // (kept same)
        },
        surface: {
          DEFAULT: "#282828", // (kept same)
          light: "#3E3E3E",   // (kept same)
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#B3B3B3",
          tertiary: "#6A6A6A",
        },
        accent: {
          DEFAULT: "#FF6B35", // Warm orange for adventure
          green: "#2ECC71",   // Nature
          blue: "#3498DB",    // Sky/water
          brown: "#8B4513",   // Earth/trails
          yellow: "#F39C12", // Sunset
        },
        trail: {
          easy: "#2ECC71",    // Green for easy trails
          moderate: "#F39C12", // Orange for moderate
          hard: "#E74C3C",    // Red for hard trails
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
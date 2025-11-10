/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Purple theme based on provided colors
        primary: {
          DEFAULT: '#9b59b6', // Main purple
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9b59b6', // Main
          700: '#7e3af2',
          800: '#6b21a8',
          900: '#581c87',
        },
        secondary: {
          DEFAULT: '#bb8fce', // Light purple
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#bb8fce', // Main
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        accent: {
          DEFAULT: '#d2b4de', // Medium lavender
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#d2b4de', // Main
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        light: {
          DEFAULT: '#f4ecf7', // Lightest lavender
          50: '#f4ecf7', // Main
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
      },
    },
  },
  plugins: [],
}

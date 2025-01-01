/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          // Main app background - darkest
          primary: '#1A1B26',
          // Header background - slightly lighter than primary
          header: '#1E1F2A',
          // Column background - medium
          column: '#1F2937',
          // Card background - lightest
          card: '#2D3748',
          // Text colors
          text: '#F7FAFC',
          muted: '#A0AEC0',
          // Border color
          border: '#4A5568',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #00C6FF, #0072FF, #6C4AB6)',
        'gradient-button': 'linear-gradient(to right, #0072FF, #6C4AB6)',
      },
    },
  },
  plugins: [],
}; 
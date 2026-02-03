/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        m3: {
          // Primary - Deep Blue
          primary: '#0B57D0', 
          'on-primary': '#FFFFFF',
          'primary-container': '#D3E3FD',
          'on-primary-container': '#041E49',

          // Surfaces
          surface: '#FDFDFD', // Main background
          'surface-container': '#FFFFFF', // Cards
          'surface-variant': '#F0F4F8', // Inputs/Gray areas
          'surface-container-high': '#F7F9FC', // Secondary areas (Legacy support)

          // Secondary & Outline
          secondary: '#5E5E62',
          'secondary-container': '#E4E6EB',
          outline: '#747775',
          'outline-variant': '#C4C7C5',

          // PACER Accents
          p: '#0B57D0', // Procedural (Blue)
          a: '#65558F', // Analogous (Purple)
          c: '#146C2E', // Conceptual (Green)
          e: '#EF9C00', // Evidence (Amber)
          r: '#B3261E', // Reference (Red)
        }
      },
      borderRadius: {
        'xl': '1rem',      // 16px
        '2xl': '1.5rem',   // 24px (Standard M3 Card)
        '3xl': '2rem',     // 32px
        'pill': '9999px',
      },
      boxShadow: {
        'm3-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        'm3-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
      }
    },
  },
  plugins: [],
}

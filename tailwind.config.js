import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // or 'media' or 'class'
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkMode: '#1a202c',
        darkModeSecondary: '#2d3748',
        lightMode: '#f7fafc',
        ice: {
          DEFAULT: '#0fa9e6',
          important: '#0c87b8',
          memo: '#3fbaeb'
        }
      },
      fontFamily: {
        headline: 'Poppins, sans-serif'
      }
    }
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.skew-10deg': {
          transform: 'skewY(-10deg)'
        },
        '.skew-15deg': {
          transform: 'skewY(-15deg)'
        }
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    })
  ]
}

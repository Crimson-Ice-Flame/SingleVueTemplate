import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
       ice:{
        DEFAULT: '#0fa9e6',
        "dark": '#0c87b8',
        "light": '#3fbaeb',
       }
      },
      fontFamily: {
        'headline': "Poppins, sans-serif",
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

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#F2EEE8',
          200: '#F69868',
        },
        gray: {
          50: '#7A7575',
          100: '#f9f9f9',
          200: '#f5f5f5',
          300: '#eeeeee',
          400: '#d9d9d9',
          500: '#acacac',
          600: '#8c8c8c',
          700: '#666666',
          800: '#1f2937',
          900: '#292929',
        },
        black: {
          100: '#332819',
        },
        secondary: {
          100: '#F6E3E0',
          200: '#96ADD7',
        },
      },
      fontFamily: {
        pretendard: ['Pretendard', 'ui-sans-serif', 'system-ui'],
        montserrat: ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

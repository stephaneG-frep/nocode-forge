/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          500: '#0f6cbd',
          600: '#0c5ca2',
          700: '#0b4c84',
        },
      },
    },
  },
  plugins: [],
};

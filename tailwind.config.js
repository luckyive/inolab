/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef6f8',
          100: '#d4ebef',
          200: '#a8d7df',
          300: '#71bcc9',
          400: '#3d9cad',
          500: '#1f7d8c',
          600: '#176572',
          700: '#145259',
          800: '#124248',
          900: '#0f373c',
        },
        ink: {
          50: '#f7f8f9',
          100: '#eef0f2',
          200: '#dde1e5',
          300: '#c2c8cf',
          400: '#9aa3ad',
          500: '#717b87',
          600: '#576069',
          700: '#444b52',
          800: '#2e3338',
          900: '#1c2024',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
};

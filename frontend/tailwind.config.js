/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#F4C95D',
          blue: '#2D6DF6',
          slate: '#0F172A',
          dark: '#050816',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(134, 239, 172, 0.05), 0 20px 30px rgba(15, 23, 42, 0.4)',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans TC"', 'sans-serif'],
      },
      colors: {
        primary: '#2E7D32',
        secondary: '#FF9800',
        alert: '#D32F2F',
        ink: '#2B221A',
        paper: '#F9F6F0',
      },
      boxShadow: {
        soft: '0 2px 4px rgba(43, 34, 26, 0.25)',
        strong: '0 2px 8px rgba(43, 34, 26, 0.35)',
      },
    },
  },
  plugins: [],
}

// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: ['./index.html', './src/**/*.{js,jsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // indigo-800
        secondary: '#3B82F6', // blue-500
        accent: '#F59E0B', // amber-500
      },
      spacing: {
        '9/16': '56.25%', // 16:9 aspect ratio helper
      },
    },
  },
  plugins: [],
};

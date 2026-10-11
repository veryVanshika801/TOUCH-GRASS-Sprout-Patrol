/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        sans: ['Nunito', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        forest: {
          900: '#163020',
          800: '#1E3F2B',
          700: '#2D5A3F',
          600: '#3D7654',
        },
        sage: {
          50: '#F6F8F5',
          100: '#EBF1E8',
          200: '#D5E3CE',
          300: '#B5CEAA',
          400: '#8FB381',
          500: '#6C965D',
        },
        meadow: {
          cream: '#FDFBF7',
          peach: '#FFE5D4',
          gold: '#F59E0B',
          sunrise: '#FF9E7D',
        }
      }
    },
  },
  plugins: [],
};

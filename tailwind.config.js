/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        greenDeep: '#1F3D2B',
        olive: '#5C7A60',
        cream: '#F7F5F0',
        beige: '#E8E1D9',
        gold: '#C2A878',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};


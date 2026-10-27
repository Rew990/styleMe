/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Same values as src/theme/tokens.ts. Change both together.
      colors: {
        primary: '#FB9342', // soft orange: buttons, links
  primaryDark: '#FF4F03', // deep orange: gradient end, highlights
  amber: '#FD8F00', // accent: badges, favourites
  sage: '#829475', // calm green: secondary buttons, tags
  background: '#FFFFFF',
  text: '#0D0D0D',
  muted: '#8A8A8A',
  border: '#DDDDDD',
  error: '#D32F2F',
      },
      fontSize: { title: '28px', body: '16px' },
    },
  },
  plugins: [],
};
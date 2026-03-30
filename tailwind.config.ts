import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0c0b0a',
          secondary: '#141210',
          tertiary: '#1a1814',
          card: 'rgba(20, 18, 16, 0.95)',
        },
        gold: {
          DEFAULT: '#b5a48a',
          light: '#c9b99f',
          dark: '#9a8a72',
          bright: '#d4c4a0',
        },
        cream: {
          DEFAULT: '#ece6d8',
          muted: '#c4bfb3',
          dark: '#a09890',
        },
        ember: '#e8572a',
        text: {
          primary: '#ece6d8',
          secondary: '#c4bfb3',
          muted: '#a09890',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        display: ['Cinzel', 'serif'],
        decorative: ['Cinzel Decorative', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;

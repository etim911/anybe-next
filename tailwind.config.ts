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
        brand: {
          gold: '#b5a48a',
          goldLight: '#c9b99f',
          goldDark: '#9a8a72',
          goldBright: '#d4c4a0',
          cream: '#ece6d8',
          creamMuted: '#c4bfb3',
          creamDark: '#a09890',
          ember: '#e8572a',
        },
        status: {
          error: '#8b3a3a',
        },
        // Legacy mappings to prevent immediate build failure if components still use them
        silver: {
          DEFAULT: '#c4bfb3',
          light: '#ece6d8',
          dim: '#a09890',
        },
        gold: {
          DEFAULT: '#b5a48a',
        },
        cream: {
          DEFAULT: '#ece6d8',
        },
        text: {
          primary: '#ece6d8',
          secondary: '#c4bfb3',
        },
        border: {
          DEFAULT: '#1a1814',
          light: 'rgba(181, 164, 138, 0.3)',
        }
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        display: ['var(--font-cinzel)', 'Cinzel', 'serif'],
        decorative: ['var(--font-cinzel-decorative)', 'Cinzel Decorative', 'serif'],
      },
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.25rem' }],
        'sm': ['1rem', { lineHeight: '1.5rem' }],
        'base': ['1.125rem', { lineHeight: '1.75rem' }],
        'lg': ['1.25rem', { lineHeight: '1.75rem' }],
        'xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      letterSpacing: {
        display: '0.15em',
        wide: '0.2em',
        decorative: '0.25em',
      },
    },
  },
  plugins: [],
};
export default config;
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
          deep: 'var(--bg-deep)',
          leather: 'var(--bg-leather)',
          card: 'var(--bg-card)',
          'card-hover': 'var(--bg-card-hover)',
        },
        silver: {
          DEFAULT: 'var(--silver)',
          light: 'var(--silver-light)',
          dim: 'var(--silver-dim)',
        },
        gold: {
          DEFAULT: 'var(--gold)',
        },
        cream: {
          DEFAULT: 'var(--cream)',
        },
        parchment: {
          DEFAULT: 'var(--parchment)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        border: {
          DEFAULT: 'var(--border)',
          light: 'var(--border-light)',
        },
        success: {
          DEFAULT: 'var(--success)',
        },
        error: {
          DEFAULT: 'var(--error)',
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
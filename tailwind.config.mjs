/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        steel: {
          50: '#f4f6f8',
          100: '#e3e8ee',
          200: '#cbd4df',
          300: '#a6b6c9',
          400: '#7c93ae',
          500: '#5d7695',
          600: '#495f7c',
          700: '#3d4e65',
          800: '#354356',
          900: '#2f3a49',
          950: '#1f2632',
        },
        industrial: {
          dark: '#1f2632',
          gray: '#354356',
          steel: '#5d7695',
          light: '#e3e8ee',
          white: '#f8fafc',
        },
        accent: {
          DEFAULT: '#a67c52',
          light: '#c4a078',
          muted: '#e8dcd2',
        },
      },
      fontFamily: {
        sans: ['Barlow', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'grid-industrial':
          'linear-gradient(to right, rgb(53 67 86 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(53 67 86 / 0.06) 1px, transparent 1px)',
        'stripes-industrial':
          'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgb(53 67 86 / 0.04) 8px, rgb(53 67 86 / 0.04) 10px)',
      },
      backgroundSize: {
        'grid-24': '24px 24px',
      },
      boxShadow: {
        'plate': '0 1px 0 0 rgb(53 67 86 / 0.08), inset 0 1px 0 0 rgb(255 255 255 / 0.6)',
        'plate-hover': '0 2px 4px rgb(31 38 50 / 0.08), inset 0 1px 0 0 rgb(255 255 255 / 0.6)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F5E6BE',
          DEFAULT: '#D4AF37', // Royal Gold
          deep: '#B8860B',    // Deep Gold
          dark: '#996515',
          metallic: '#C5A059'
        },
        maroon: {
          deep: '#350812',
          DEFAULT: '#4A0E1B', // Dark Maroon
          rich: '#6D1427',   // Rich Burgundy
          light: '#881b32',
        },
        cream: {
          DEFAULT: '#FFF8E7', // Warm Cream
          soft: '#FFFDF9',
        },
        ivory: {
          DEFAULT: '#FFFCF5', // Ivory White
        },
        dark: {
          text: '#2B1717',
          muted: '#5A3E3E',
        }
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        couple: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'Lato', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'serif']
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.35)',
        'gold-glow-lg': '0 0 45px rgba(212, 175, 55, 0.5)',
        'maroon-deep': '0 10px 30px rgba(74, 14, 27, 0.4)',
        'card-luxury': '0 15px 35px -5px rgba(43, 23, 23, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.25)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          cream: '#FFF9F5',
          'pastel-pink': '#FCE4EC',
          'light-blue': '#E3F2FD',
          peach: '#FFE0B2',
        },
        fontFamily: {
          serif: ['Playfair Display', 'serif'],
          sans: ['Inter', 'sans-serif'],
        },
        borderRadius: {
          '3xl': '1.5rem',
          '4xl': '2rem',
        },
        animation: {
          'fade-in-up': 'fadeInUp 0.6s ease-out',
          'fade-in-scale': 'fadeInScale 0.6s ease-out',
          'shimmer': 'shimmer 2s infinite',
        },
        keyframes: {
          fadeInUp: {
            '0%': { opacity: '0', transform: 'translateY(30px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          fadeInScale: {
            '0%': { opacity: '0', transform: 'scale(0.9)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
          },
          shimmer: {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
        },
        boxShadow: {
          'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
          'hover': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    plugins: [],
  }
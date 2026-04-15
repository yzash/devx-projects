/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mf: {
          blue: '#0057FF',
          'blue-light': '#E8F0FF',
          'blue-dark': '#0042CC',
          'blue-50': '#F0F5FF',
          coral: '#FF6B35',
          'coral-light': '#FFF0EB',
          gold: '#D4A853',
          'gold-light': '#FFF8E7',
          silver: '#8B95A5',
          'silver-light': '#F4F5F7',
          platinum: '#6366F1',
          'platinum-light': '#EEF0FF',
          dark: '#1A1A2E',
          gray: '#6B7280',
          'gray-light': '#F8FAFC',
          'gray-medium': '#E5E7EB',
          success: '#10B981',
          warning: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-delay': 'fadeIn 0.6s ease-out 0.2s forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-up-delay-1': 'slideUp 0.5s ease-out 0.1s forwards',
        'slide-up-delay-2': 'slideUp 0.5s ease-out 0.2s forwards',
        'slide-up-delay-3': 'slideUp 0.5s ease-out 0.3s forwards',
        'slide-up-delay-4': 'slideUp 0.5s ease-out 0.4s forwards',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'mf': '0 2px 12px rgba(0, 87, 255, 0.08)',
        'mf-lg': '0 8px 30px rgba(0, 87, 255, 0.12)',
        'mf-card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06)',
        'mf-card-hover': '0 4px 16px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

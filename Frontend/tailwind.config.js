export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#102A43',
          50: '#E8EDF3',
          100: '#C5D3E0',
          200: '#9BB3C8',
          300: '#6E91AD',
          400: '#4A7494',
          500: '#2D5678',
          600: '#1A3F5C',
          700: '#102A43',
          800: '#0B1F33',
          900: '#071A2B',
        },
        'navy-dark': '#071A2B',
        amber: {
          DEFAULT: '#F5B942',
          50: '#FEF9EC',
          100: '#FDF3DC',
          500: '#F5B942',
          600: '#D99E1F',
        },
        teal: {
          DEFAULT: '#008C95',
          50: '#E6F7F8',
          100: '#B3E8EB',
          500: '#008C95',
          600: '#006D74',
        },
        'setu-green': '#22A06B',
        'setu-red': '#D64545',
        canvas: '#F4F7FB',
        surface: '#FFFFFF',
        muted: '#64748B',
        border: '#E2E8F0',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(16, 42, 67, 0.06)',
        card: '0 1px 3px rgba(16, 42, 67, 0.08), 0 4px 12px rgba(16, 42, 67, 0.04)',
        elevated: '0 8px 24px rgba(16, 42, 67, 0.12), 0 2px 8px rgba(16, 42, 67, 0.06)',
        nav: '0 1px 0 rgba(255,255,255,0.08) inset, 0 4px 16px rgba(7, 26, 43, 0.2)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'typing-dot': 'typingDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        typingDot: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
};

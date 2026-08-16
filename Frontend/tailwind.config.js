export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        navy: '#102A43',
        'navy-dark': '#071A2B',
        amber: '#F5B942',
        teal: '#008C95',
        'setu-green': '#22A06B',
        'setu-red': '#D64545',
        canvas: '#F7F9FC',
        muted: '#64748B',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
}

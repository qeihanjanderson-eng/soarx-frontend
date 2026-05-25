/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'soarx-navy': '#0A1B2A',
        'soarx-silver': '#C7CED6',
        'soarx-white': '#FFFFFF',
        'soarx-orange': '#E67E22',
        'soarx-electric-blue': '#1A73E8',
        'soarx-cyber-green': '#00F5A0',
        'soarx-deep-gray': '#1F2937',
        'soarx-cyan': '#38BDF8',
        'soarx-teal': '#2DD4BF',
        'soarx-gold': '#FBBF24',
        'soarx-charcoal': '#0B1320',
      },
      boxShadow: {
        'soarx-glow': '0 0 20px rgba(26, 115, 232, 0.4)',
        'soarx-glow-green': '0 0 15px rgba(0, 245, 160, 0.3)',
        'soarx-panel': '0 25px 80px rgba(0, 0, 0, 0.28)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'soarx-gradient': 'linear-gradient(135deg, #0A1B2A 0%, #1F2937 100%)',
        'soarx-gradient-blue': 'linear-gradient(135deg, #0A1B2A 0%, #1A73E8 100%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};

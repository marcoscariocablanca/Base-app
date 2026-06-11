/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          // Core neutrals — from the logo background
          black:   '#0D0D0B',   // Negro profundo
          'black-pure': '#0D0D0D',
          dim:     '#181816',   // Card backgrounds
          panel:   '#141412',   // Inputs, deep panels
          border:  '#252520',   // Subtle borders
          muted:   '#343430',   // Muted elements

          // Neutrals — from the "BASE" text in logo
          white:   '#F5F4EF',   // Blanco roto
          ivory:   '#EAE4CE',   // Marfil — matches logo wordmark color
          stone:   '#8A8A7A',   // Gris piedra

          // Greens — from the dark forest accents
          forest:  '#2D4A3E',   // Verde bosque oscuro
          olive:   '#5C6030',   // Verde oliva envejecido
          success: '#4A7C59',   // Verde suave éxito

          // Gold — primary accent from the logo mark
          gold:        '#8A7E38', // Mid gold — muted, premium
          'gold-light':'#A89A46', // Catching light — toned down
          'gold-bright':'#BCA84E',// Highlight — warm not yellow
          'gold-deep': '#5A5018', // Shadow / depth
          'gold-muted':'#706430', // Subtle gold text

          // Warning — golden tones
          warning: '#C4A35A',

          // Text hierarchy
          'text-primary':   '#EAE4CE', // Ivory — headlines
          'text-secondary': '#A8A49A', // Stone — subtext
          'text-muted':     '#686460', // Very muted
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
        serif: [
          'Georgia',
          '"Palatino Linotype"',
          'Palatino',
          '"Book Antiqua"',
          'serif',
        ],
        mono: ['"SF Mono"', '"Fira Code"', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
        '3xs': ['0.5rem',   { lineHeight: '0.75rem' }],
      },
      letterSpacing: {
        widest:  '0.2em',
        display: '0.25em', // For the BASE wordmark
        caps:    '0.15em',
      },
      borderRadius: {
        'xl':  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out',
        'fade-up':    'fadeUp 0.4s ease-out',
        'slide-up':   'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'check-pop':  'checkPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shimmer':    'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        checkPop: {
          '0%':   { transform: 'scale(0.7)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-base':    'linear-gradient(180deg, #0D0D0B 0%, #141412 100%)',
        'gradient-forest':  'linear-gradient(135deg, #1E3028 0%, #141412 100%)',
        'gradient-card':    'linear-gradient(180deg, #181816 0%, #141412 100%)',
        'gradient-gold':    'linear-gradient(135deg, #C8AE42 0%, #7A6424 100%)',
        'gradient-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(212,184,72,0.08) 50%, transparent 100%)',
      },
      boxShadow: {
        'gold-sm': '0 0 0 1px rgba(154,138,53,0.3)',
        'gold':    '0 0 0 1px rgba(154,138,53,0.5), 0 4px 24px rgba(154,138,53,0.08)',
        'card':    '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
      },
    },
  },
  plugins: [],
}

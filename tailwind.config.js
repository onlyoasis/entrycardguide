// DESIGN SYSTEM TOKENS — do not edit without reading DESIGN.md
// All values below are locked by /design-consultation 2026-04-23.
// Adding tints/shades, shadows, pill radii, or blue will break the anti-scam
// visual positioning. If you need a new token, edit DESIGN.md first, then mirror here.

module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{html,md}',
    './assets/js/**/*.{js,ts}',
  ],
  theme: {
    // EXPLICIT colors only. No tint scales. No blue. No purple.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF', // reserved: ONLY for validator tool bg (signals "interactive")
      ink: '#1A1A1A',
      paper: '#FAFAF7',
      rule: '#E8E6DF',
      muted: '#6B6B66',
      verified: '#0F7356',
      scam: '#B33A1E',
      mark: '#F5E6A8',
    },
    fontFamily: {
      serif: ['Fraunces', 'Georgia', 'Iowan Old Style', 'serif'],
      sans: ['"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['"Geist Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
    },
    fontSize: {
      'meta': ['11px', { lineHeight: '1.4', letterSpacing: '0.12em' }],
      'xs': ['12px', { lineHeight: '1.5' }],
      'small': ['14px', { lineHeight: '1.5' }],
      'mono': ['15px', { lineHeight: '1.4' }],
      'body': ['17px', { lineHeight: '1.65' }],
      'h3': ['18px', { lineHeight: '1.4' }],
      'kicker': ['19px', { lineHeight: '1.5' }],
      'h2': ['24px', { lineHeight: '1.3' }],
      'h1': ['42px', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
      'h1-mobile': ['32px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
    },
    // Small radii ONLY. No pills, no rounded-xl.
    borderRadius: {
      'none': '0',
      'sm': '2px',
      DEFAULT: '2px',
      'md': '4px',
      'lg': '6px',
    },
    maxWidth: {
      prose: '680px',
      container: '1120px',
      rail: '280px',
    },
    extend: {
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        // Semantic spacing tokens used across layouts and main.css.
        // Stays on an 8px rhythm.
        'xs': '0.5rem',  // 8px
        'sm': '0.75rem', // 12px
        'md': '1.5rem',  // 24px
        'lg': '2.5rem',  // 40px
        'xl': '4rem',    // 64px
      },
      letterSpacing: {
        wide2: '0.08em',
        wide3: '0.12em',
        wide4: '0.15em',
        wide5: '0.2em',
      },
      // Motion: near-zero. These are the ONLY transitions allowed.
      transitionDuration: {
        'link': '80ms',
        'state': '120ms',
      },
    },
  },
  // Block dangerous classes via safelist inversion: we DON'T generate them.
  // If you find yourself reaching for one of these, you're probably on the wrong track.
  corePlugins: {
    // Explicitly disabled — if you want these back, read DESIGN.md first
    boxShadow: false, // no shadows
    gradientColorStops: false, // no gradients
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

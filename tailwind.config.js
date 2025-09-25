/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // ScaleForge Design System Colors
        'sf-background': {
          primary: '#0A1117',
        },
        'sf-border': {
          primary: '#0A171E',
        },
        'sf-shadow': {
          light: 'rgba(16, 24, 40, 0.03)',
          medium: 'rgba(16, 24, 40, 0.08)',
        },
      },
      borderRadius: {
        'xs': '4px',
      },
      boxShadow: {
        'sf-lg': '0 4px 6px -2px rgba(16, 24, 40, 0.03), 0 12px 16px -4px rgba(16, 24, 40, 0.08)',
      },
      spacing: {
        'dropdown-w': '240px',
        'dropdown-h': '427px',
        'badge-w': '205px',
        'badge-h': '237px',
      },
    },
  },
  plugins: [],
}

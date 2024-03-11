/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 200ms ease-out',
        fadeInUp: 'fadeInUp 250ms ease-out',
      },
      colors: {
        clinic: {
          primary: '#2563eb',
          accent: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
      },
    },
  },
  safelist: [
    // dynamic nav link colors used in App.tsx
    'text-blue-700',
    'hover:bg-blue-100',
    'text-green-700',
    'hover:bg-green-100',
    'text-purple-700',
    'hover:bg-purple-100',
    // clinic theme utility classes used dynamically
    'bg-clinic-primary',
    'text-clinic-primary',
    'border-clinic-primary',
    'bg-clinic-accent',
    'text-clinic-accent',
    'border-clinic-accent',
    'bg-clinic-warning',
    'text-clinic-warning',
    'bg-clinic-danger',
    'text-clinic-danger',
  ],
  plugins: [],
};

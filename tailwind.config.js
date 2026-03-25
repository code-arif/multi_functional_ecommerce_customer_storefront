export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2E7D32', light: '#4CAF50', pale: '#E8F5E9', dark: '#1B5E20' },
        sidebar: '#0F172A',
        'sidebar-hover': '#1E293B',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: { card: '0 1px 8px rgba(0,0,0,0.06)', modal: '0 20px 60px rgba(0,0,0,0.15)' }
    }
  },
  plugins: []
}
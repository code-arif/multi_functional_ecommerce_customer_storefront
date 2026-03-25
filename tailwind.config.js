/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2E7D32",
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        brand: {
          green: "#2E7D32",
          light: "#4CAF50",
          accent: "#81C784",
          pale: "#E8F5E9",
          dark: "#1B5E20",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 8px rgba(0,0,0,.06)",
        hover: "0 8px 32px rgba(0,0,0,.10)",
        green: "0 4px 16px rgba(46,125,50,.22)",
      },
      animation: {
        "fade-up": "fadeUp .35s ease both",
        "fade-in": "fadeIn .25s ease both",
        "slide-down": "slideDown .2s ease both",
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(14px)" },
          to: { opacity: 1, transform: "none" },
        },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideDown: {
          from: { opacity: 0, transform: "translateY(-8px)" },
          to: { opacity: 1, transform: "none" },
        },
      },
    },
  },
  plugins: [],
};

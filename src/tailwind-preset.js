/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        allauth: {
          DEFAULT: "#C6426E",
          50: "#F1CFDA",
          100: "#ECBFCE",
          200: "#E2A0B6",
          300: "#D9819E",
          400: "#CF6186",
          500: "#C6426E",
          600: "#A03055",
          700: "#75233E",
          800: "#4A1627",
          900: "#1E0910",
          950: "#090305"
        },
        // Gray (slate variant) - matches library's default
        gray: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617"
        },
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"]
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}

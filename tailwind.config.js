/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './.storybook/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Convert gray to slate (matching Strands)
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
        red: {
          DEFAULT: "#EE5341",
          50: "#FDECEA",
          100: "#FBDBD7",
          200: "#F8B9B1",
          300: "#F5978C",
          400: "#F17566",
          500: "#EE5341",
          600: "#E32A14",
          700: "#AF2010",
          800: "#7C170B",
          900: "#480D06",
          950: "#2E0904"
        },
        primary: {
          400: "#cd567e",
          500: "#C6426E",
          600: "#B53b64"
        },
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
        green: {
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
          950: "#052e16"
        },
        yellow: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
          950: "#422006"
        }
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"]
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}

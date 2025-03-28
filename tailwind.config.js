/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        newCodes:{
          sideLinks:'rgba(172, 182, 191, 0.5)',
          sideLinksHover:'#fff',
          sideLinksActive:'#fff',
          background:"#1d2126",
          foreground:"#272c33",
          breadcrumb:'rgba(242, 249, 255, .7)',
        },
        primary: {
          100: "#1E293B",
          200: "#1e293b",
          400: "#334155",
          500: "#475569",
        },
        gray: {
          200: "#E2E8F0",
          400: "#94A3B8",
          500: "#64748B",
        },
        blue: {
          400: "#60A5FA",
          300: "#7DD3FC",
          600: "#0284C7",
        },
        yellow: {
          600: "#CA8A04",
          700: "#F97316",
        },
        red: {
          500: "#EF4444",
        },
        green: {
          600: "#16A34A",
        },
        secondary: {
          100: "",
        },
      },
    },
  },
  plugins: [],
};

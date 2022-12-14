/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../../packages/**/*.{js,ts,jsx,tsx}", "./**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      fontSize: {
        xl: "1.3125rem",
        "3xl": "2rem",
        "6xl": "4rem",
        "8xl": "6rem",
      },
      lineHeight: {
        snug: "1.4",
        relaxed: "1.6",
        loose: "1.7",
      },
      boxShadow: {
        lg: "0 8px 16px 0 #DDE2E8",
        md: "0 4px 4px 0 #00000040",
      },
      colors: {
        blue: {
          50: "#EAF4F9",
          100: "#D5EAF4",
          300: "#2F97C9",
          500: "#1470C6",
          600: "#167EDF",
        },
        red: {
          50: "#FEF6F8",
          100: "#FCDAE2",
          500: "#F0486E",
        },
        purple: {
          50: "#F6EEFF",
          100: "#EEDEFF",
          500: "#AC58FF",
        },
        gray: {
          50: "#F5F7FB",
          500: "#F3F5FA",
          600: "#DDE2E8",
          900: "#202224",
        },
        gold: {
          50: "#FFFBF1",
          100: "#FDF1D6",
          400: "#FED971",
          500: "#FECF4B",
          600: "#FFC527",
          900: "#9B7305",
        },
        comet: {
          50: "#F5F5F5",
          500: "#4E5374",
          900: "#1A203B",
        },
      },
    },
  },
  plugins: [],
};

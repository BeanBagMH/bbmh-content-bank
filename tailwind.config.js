/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#252527",
        cyan: "#1F8E8D",
        yellow: "#FAD74F",
        turq: "#9AE3D3",
        red: "#F27D7D",
        background: "#f7f7f5",
        border: "#e5e5e2",
        muted: "#8a8a85",
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        display: ['Anton', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

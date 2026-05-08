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
        charcoal: "#3F3F3F",
        cyan: "#1F8E8D",
        turquoise: "#9AE3D3",
        "light-grey": "#F2F2F2",
        ash: "#666666",
        mist: "#e2e2e2",
      },
      fontFamily: {
        display: ['Cabinet Grotesk', 'sans-serif'],
        body: ['Roundo', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
      },
    },
  },
  plugins: [],
}

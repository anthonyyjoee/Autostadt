module.exports = {
  content: [
    './views/login/**/*.{html,ejs,js}',
    './views/**/*.{ejs,js}'
],
  theme: {
    extend: {
      colors: {
        gray: "#a3a3a3",
        warn: "#FFC007",
        danger: "#DC3547"
      },
      height: {
        '128': '35rem',
        '75': '19rem'
    }
    }
  },
  plugins: [],
}

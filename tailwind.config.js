const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      width: {
        "1/25": "calc((5 / 5 / 25) * 100%)",
      },
      boxShadow: {
        "red": "0px 0px 2px 4px rgba(255, 0, 0, 0.25)",
      },
      dropShadow: {
        "outline": "0 0 0.6px rgba(0,0,0,1)",
      }
    },
  },
  plugins: [],
});

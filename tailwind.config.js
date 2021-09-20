const plugin = require("tailwindcss/plugin");

module.exports = {
  purge: ["./src/**/*.js", "./schemas/**/*.json"],
  mode: "jit",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        md: "2rem",
        lg: "5rem",
        xl: "8rem",
        "2xl": "5rem",
      },
    },
    typography: {
      DEFAULT: {
        css: {
          color: "#fff",
          fontSize: "16px",
          h1: {
            fontSize: "36px",
            fontWeight: "600",
            lineHeight: 1.1111111,
            color: "#fff",
          },
          h2: {
            fontSize: "30px",
            fontWeight: "600",
            color: "#fff",
            lineHeight: 1.3333,
          },
          h3: {
            fontSize: "24px",
            fontWeight: "600",
            color: "#fff",
            lineHeight: 1.6,
          },
          h4: {
            color: "#fff",
            fontWeight: "600",
            lineHeight: 1.5,
          },
          h5: {
            color: "#fff",
            fontWeight: "600",
            lineHeight: 1.5,
          },
          h6: {
            color: "#fff",
            fontWeight: "600",
            lineHeight: 1.5,
          },
          a: {
            textDecoration: "underline",
          },
        },
      },
    },

    extend: {
      fontFamily: { saira: ['"Saira"', '"sans-serif"'] },
      screens: {
        print: { raw: "print" },
        phone: { max: "767px" },
        tablet: { max: "1023px" },
        xs: "460px",
        "2xl": "1420px",
      },
      spacing: {
        28: "7rem",
      },
      colors: {
        red: {
          DEFAULT: "#FB385C",
        },
        green: {
          DEFAULT: "#4EE996",
        },
        yellow: {
          DEFAULT: "#FCB912",
        },
        white: "#fff",
        primary: {
          light: "#ceb9eb",
          DEFAULT: "#512c84",
          dark: "#150728",
        },
        dark: "#080112",
      },
      backgroundColors: {
        white: "#fff",
        primary: {
          light: "#CEB9EB",
          DEFAULT: "#512c84",
          dark: "#150728",
        },
        dark: "#080112",
      },
      width: (theme) => ({
        auto: "auto",
        ...theme("spacing"),
        full: "100%",
        screen: "100vw",
      }),
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    plugin(function ({ addUtilities, theme, variants, e }) {
      const spacing = theme("spacing");
      const width = theme("width");
      addUtilities(
        [
          Object.entries(spacing).map(([key, value]) => {
            return {
              [`.${e(`row-x-${key}`)}`]: {
                "--row-x": `${value}`,
              },
            };
          }),
          Object.entries(width).map(([key, value]) => {
            return {
              [`.${e(`cols-${key}`)}`]: {
                "--cols-w": `${value}`,
              },
            };
          }),
          Object.entries(spacing).map(([key, value]) => {
            return {
              [`.${e(`row-y-${key}`)}`]: {
                "--row-y": `${value}`,
              },
            };
          }),
        ],
        variants(["responsive"])
      );
    }),
  ],
};

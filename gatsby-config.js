require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
const path = require("path");
module.exports = {
  siteMetadata: {
    title: `Starter`,
    description: `Gatsby project starter for the workfow I use.`,
    author: `@EpikPrime`,
    siteUrl: "https://epikprime.com",
  },
  plugins: [
    {
      resolve: "gatsby-source-prismic",
      options: {
        repositoryName: process.env.GATSBY_PRISMIC_REPO_NAME,
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        customTypesApiToken: process.env.PRISMIC_CUSTOM_TYPES_API_TOKEN,
        linkResolver:
          ({ node, key, value }) =>
          (doc) => {
            if (doc.type === "game") {
              return `/game/${doc.uid}/`;
            } else if (doc.type === "page") {
              return doc.uid === "homepage" ? "/" : `/${doc.uid}/`;
            } else {
              return "/";
            }
          },
      },
    },
    `gatsby-plugin-emotion`,
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-TW89H3J",

        // Include GTM in development.
        //
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,

        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        //
        // Defaults to null
        defaultDataLayer: { platform: "gatsby" },

        // Specify optional GTM environment details.
        //gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
        //gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
        //dataLayerName: "YOUR_DATA_LAYER_NAME",

        // Name of the event that is triggered
        // on every Gatsby route change.
        //
        // Defaults to gatsby-route-change
        //routeChangeEventName: "YOUR_ROUTE_CHANGE_EVENT_NAME",
        // Defaults to false
        enableWebVitalsTracking: true,
      },
    },

    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: [
            {
              family: "Saira",
              variants: ["300", "400", "600", "700"],
            },
            {
              family: "Roboto Mono",
              variants: ["400", "700"],
            },
          ],
        },
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          "@marketplace": path.resolve(__dirname, "src/components/Marketplace"),
          "@components": path.resolve(__dirname, "src/components"),
          "@api": path.resolve(__dirname, "src/_api"),
          "@images": path.resolve(__dirname, "src/images"),
          "@lib": path.resolve(__dirname, "src/lib"),
          "@utils": path.resolve(__dirname, "src/utils"),
          "@prismic": path.resolve(__dirname, "src/prismic"),
          "@icons": path.resolve(__dirname, "src/icons"),
          "@contracts": path.resolve(__dirname, "src/contracts"),
          "@helpers": path.resolve(__dirname, "src/helpers"),
        },
      },
    },
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        // Defaults used for gatsbyImageData and StaticImage
        defaults: {},
        // Set to false to allow builds to continue on image errors
        failOnError: false,
      },
    },
    `gatsby-transformer-sharp`,
    "gatsby-plugin-loadable-components-ssr",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Epikprime`,
        short_name: `Epikprime`,
        start_url: `/`,
        icon: "src/images/logo.png",
        background_color: `#f7f0eb`,
        theme_color: `#150728`,
        display: `standalone`,
      },
    },
    "gatsby-plugin-no-sourcemaps",
    process.env.BRANCH == "master"
      ? {
          resolve: "gatsby-plugin-remove-console",
          options: {
            exclude: ["error", "warn"], // <- will be removed all console calls except these
          },
        }
      : undefined,
  ].filter(Boolean),
};

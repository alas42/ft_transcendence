import colors from "vuetify/es5/util/colors";
import "dotenv/config";

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  env: {
    API_URL: process.env.API_URL,
    NUXT_PORT: process.env.NUXT_PORT,
    NUXT_HOST: process.env.NUXT_HOST,
    API_SOCKET_GAMEROOM: process.env.API_SOCKET_GAMEROOM,
    API_SOCKET_STATUS: process.env.API_SOCKET_STATUS
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    // titleTemplate: '%s',
    title: "PONG GAME",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-socket-io',
  ],

  io: {
    // module options
    sockets: [
      { name: 'chat', url: process.env.API_URL },
      { name: 'gameroom', url: process.env.API_SOCKET_GAMEROOM },
      { name: 'socketstatus', url: process.env.API_SOCKET_STATUS, withCredentials: true }
    ],
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: `${process.env.API_URL}`,
    credentials: true,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: true,
      themes: {
        dark: {
          background: colors.grey.darken3,
          primary: colors.deepPurple.darken4,
          accent: colors.deepOrange.accent3,
          secondary: colors.deepPurple.darken2,
          info: colors.deepPurple.lighten4,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};

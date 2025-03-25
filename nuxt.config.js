import colors from 'vuetify/es5/util/colors'

export default {
  router: {
    middleware: ['auth']
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - personalCount',
    title: 'personalCount',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],
  // Firebase
  target: 'static', // Configurar Nuxt en modo estático
  generate: {
    fallback: true  // Si usas rutas dinámicas, puedes configurarlo para un fallback a index.html
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/firebase.js',
    "~/plugins/firebaseUpdate.js",
    { src: '~/plugins/vue2TouchEvents.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    preference: 'system', // establece el valor inicial como 'system', 'light' o 'dark'
    fallback: 'light', // modo predeterminado si no se detecta preferencia
    classSuffix: '' // elimina el sufijo en las clases CSS (por defecto es `-mode`)
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primaryColor: "#FF8F00",
          secondaryColor: "#2E7D32",
          neutralColor: "#546E7A",
          dangerColor: "#E53945",
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primaryColor: "#FF8F00",
          secondaryColor: "#2E7D32",
          neutralColor: "#546E7A",
          dangerColor: "#E53945",
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}

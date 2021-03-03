import * as dotenv from "dotenv";
import { Common } from '~/types/common';
dotenv.config();

declare module 'vue/types/vue' {
  interface Vue {
    $auth: any
    $bvModal: any
    $common: Common
    $bvToast: any
  }
}

export default {
  mode: 'spa',
  env: {},
  head: {
    title: "Micro ERP",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "VNLAB" }
    ],
      link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
    ]
  },
  loading: '~/components/Loading',
  css: [
    "~/assets/css/main.css",
    "~/assets/css/responsive.css",
    '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css',
  ],
  middleware: ['auth'],
  auth: {
    rewriteRedirects: true,
    redirect: {
      login: '/user/login',
      logout: '/user/login',
      home: '/home-admin',
      callback: '/user/login'
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/auth/login",
            method: "POST",
            propertyName: "data.token",
          },
          user: {
            url: "/api/user/getuser",
            method: "GET",
            propertyName: "data"
          },
          logout: {
            url: "/auth/logout",
            method: "GET",
          },
        },
      }
    },
  },
  router: {
    middleware: ['auth']
  },
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxt/typescript-build'
  ],
  build: {
    extractCSS: true,
    /*
    Debug Vue, typescript
    extend(config:any, ctx:any) {
      return Object.assign({}, config, {
        devtool: 'source-map'
      })
    },
    */
    transpile: [
      'vee-validate/dist/rules'
    ]
  },
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/auth",
    "bootstrap-vue/nuxt",
    '@nuxtjs/firebase',
  ],
  firebase: {
    config: {
      apiKey: "AIzaSyDriB-22FOYiG30kVp2xiN-ObYz4elqoK4",
      authDomain: "microerp-265008.firebaseapp.com",
      databaseURL: "https://microerp-265008.firebaseio.com",
      projectId: "microerp-265008",
      storageBucket: "microerp-265008.appspot.com",
      messagingSenderId: "474093391726",
      appId: "1:474093391726:web:4eba821296c8e3a5c6bb7f",
      measurementId: "G-ED1YHY07N2"
    },
    services: {
      messaging: {
        createServiceWorker: true
      }
    }
  },
  axios: {
    baseURL: process.env.NUXT_ENV_AXIOS_BASE_URL
  },
  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  plugins: [
    "~/plugins/vee-validate",
    "~/plugins/axios",
    "~/plugins/aos.js",
    "~/plugins/vue-i18n",
    "~/plugins/vue-infinite-loading",
    "~/plugins/autosize",
    "~/plugins/common",
  ],
}

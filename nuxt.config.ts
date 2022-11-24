// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: [
        'nuxt-windicss',
    ],
    build: {
        postcss: {
            postcssOptions: require("./postcss.config.js"),
        },
    },
    ssr: false,
    publicRuntimeConfig: {
        API_BASE_URL: process.env.API_BASE_URL,
        INFURA_ID: process.env.INFURA_ID,
    }
})

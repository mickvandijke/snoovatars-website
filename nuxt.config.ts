// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: [
        'nuxt-windicss',
    ],
    ssr: false,
    runtimeConfig: {
        public: {
            SITE_URL: process.env.SITE_URL,
            API_BASE_URL: process.env.API_BASE_URL
        }
    }
})

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    ssr: false,
    runtimeConfig: {
        public: {
            SITE_URL: process.env.SITE_URL,
            API_BASE_URL: process.env.API_BASE_URL,
            POLYGON_RPC_URL: process.env.POLYGON_RPC_URL
        }
    },
    modules: [
        '@nuxt/image',
    ],
    image: {
        provider: 'static'
    },
})

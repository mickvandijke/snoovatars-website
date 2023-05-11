// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    modules: [
        [
            'nuxt-cloudflare-analytics',
            {
                // See below for more options
                token: '3f57e38f01704cc1900c1340798821c3', // Example 1a2b3v4a5er6ac7r8afd
                proxyPath: true,
            },
        ],
    ],
    ssr: false,
    runtimeConfig: {
        public: {
            SITE_URL: process.env.SITE_URL,
            API_BASE_URL: process.env.API_BASE_URL
        }
    }
})

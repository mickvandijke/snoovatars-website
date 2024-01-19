/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
        "./global/*.{js,ts}",
    ],
    theme: {
        extend: {
            animation: {
                'pulse-slow': 'pulse 4s linear infinite',
            },
            colors: {
                "primary": "rgb(25, 27, 31)",
                "secondary": "rgb(30, 31, 35)",
                "tertiary": "rgb(35, 35, 39)",
                "reddit": "rgb(255, 86, 0, 1)",
                "header": "rgb(245, 245, 245)",
                "details": "rgb(163, 163, 163)"
            }
        },
    },
    plugins: [],
}

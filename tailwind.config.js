/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
    ],
    theme: {
        extend: {
            animation: {
                'pulse-slow': 'pulse 4s linear infinite',
            },
            colors: {
                "border-primary": "rgba(255, 255, 255, 0.1)"
            }
        },
    },
    plugins: [],
}

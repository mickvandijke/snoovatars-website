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
                "border-primary": "rgba(255, 255, 255, 0.1)",
                "primary": "rgba(25, 28, 31, 1)",
                "primary-border": "rgba(255, 255, 255, 0.08)",
                "primary-accent": "rgba(255, 255, 255, 0.04)",
                "primary-accent-hover": "rgba(255, 255, 255, 0.1)",
                "primary-accent-solid": "rgba(34, 37, 40, 1)"
            }
        },
    },
    plugins: [],
}

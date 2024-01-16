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
                "border-primary": "rgba(255, 255, 255, 0.1)",
                "primary": "rgba(25, 28, 31, 1)",
                "primary-border": "rgba(255, 255, 255, 0.08)",
                "primary-accent": "rgba(255, 255, 255, 0.04)",
                "primary-accent-hover": "rgba(255, 255, 255, 0.1)",
                "primary-accent-solid": "rgba(34, 37, 40, 1)",
                "primary-dark": "#131517",
                "ios-bg-primary": "#000000",
                "ios-bg-secondary": "rgb(28 28 29)",
                "ios-bg-navbar": "rgba(18, 18, 18, 0.8)",
                "ios-text-primary": "rgb(255, 255, 255)",
                "ios-text-secondary": "rgba(255, 255, 255, .55)",
                "ios-text-tertiary": "rgb(107 114 128)",
                "reddit": "rgb(255, 86, 0, 1)"
            }
        },
    },
    plugins: [],
}

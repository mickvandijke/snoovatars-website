import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            external: ['chart.js', 'vue-chartjs']
        }
    }
});

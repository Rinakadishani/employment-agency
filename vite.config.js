import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
                        return 'vendor'
                    }
                    if (id.includes('node_modules/@inertiajs/')) {
                        return 'inertia'
                    }
                    if (id.includes('node_modules/recharts/')) {
                        return 'charts'
                    }
                    if (id.includes('node_modules/axios/')) {
                        return 'http'
                    }
                },
            },
        },
        chunkSizeWarningLimit: 500,
    },
})
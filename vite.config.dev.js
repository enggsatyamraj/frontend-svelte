import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
	plugins: [svelte()],
	base: '/assets/',
	server: {
		port: 3000,
		strictPort: false,
		open: true,
		proxy: {
			'/api': {
				target: 'http://localhost:5000',
				changeOrigin: true,
				secure: false,
			}
		}
	},
	build: {
		outDir: "./dist",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: "src/main.js"
			},
			output: {
				manualChunks: (id) => {
					if (id.includes('node_modules')) {
						if (id.includes('svelte')) {
							return 'svelte-vendor';
						}
						return 'vendor';
					}
				},
				entryFileNames: "[name].js",
				chunkFileNames: "[name]-[hash].js",
				assetFileNames: "[name]-[hash][extname]"
			},
		},
		sourcemap: true
	},
	optimizeDeps: {
		include: ['svelte', 'svelte/internal', 'svelte-spa-router']
	}
});

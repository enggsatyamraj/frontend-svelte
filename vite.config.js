import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
	plugins: [svelte()],
	build: {
		outDir: "../public/assets/svelte",
		rollupOptions: {
			input: {
				main: "src/main.js",
				advertiser: "src/advertiser.js",
				publisher: "src/publisher.js",
				dashboard: "src/dashboard.js",
				campaigns: './src/campaigns.js'
			},
			output: {
				manualChunks: {
					vendor: ['svelte', 'svelte/internal', 'lodash', 'moment', 'moment-timezone', 'svelte-feather-icons'],
				},
				entryFileNames: "[name].js",
			},
		},
	},
});

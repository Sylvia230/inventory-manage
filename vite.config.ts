import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
	base: '/',
	plugins: [
		react(),
		Unocss()
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	server: {
		hmr: true,
		host: true,
		// allowedHosts: ['dayin.kuaidizs.cn','multishoptest.kuaidizs.cn'],
		proxy: {
		  ['/api']: {
			target: 'http://120.26.232.36:9001/gdv',
			// target: 'http://multishop.kuaidizs.cn',
			changeOrigin: true,
			rewrite: (path) => path.replace(/^\/api/, ''),
		  },
		}
	  },
})

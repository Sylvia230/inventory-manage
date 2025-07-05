import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

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
			'@': resolve(__dirname, 'src')
		}
	},
	server: {
		// hmr: true,
		host: '127.0.0.1',
		port: 9001,
		proxy: {
			['/api']: {
				target: 'http://120.26.232.36/gdv/',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, ''),
				configure: (proxy, options) => {
					proxy.on('proxyReq', (proxyReq, req, res) => {
						// 移除可能导致跨域问题的请求头
						proxyReq.removeHeader('referer');
						proxyReq.removeHeader('origin');
					});
					proxy.on('proxyRes', (proxyRes, req, res) => {
						// 设置正确的 CORS 响应头
						proxyRes.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:9001';
						proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE';
						proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
						proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
					});
				},
			},
			// 图片文件代理
			['/uploads']: {
				target: 'http://120.26.232.36/gdv/',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/uploads/, '/uploads'),
				configure: (proxy, options) => {
					proxy.on('proxyReq', (proxyReq, req, res) => {
						// 移除可能导致跨域问题的请求头
						proxyReq.removeHeader('referer');
						proxyReq.removeHeader('origin');
					});
					proxy.on('proxyRes', (proxyRes, req, res) => {
						// 设置正确的 CORS 响应头
						proxyRes.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:9001';
						proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE';
						proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
						proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
					});
				},
			},
			// 文件代理（通用）
			['/files']: {
				target: 'http://120.26.232.36/gdv/',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/files/, '/files'),
				configure: (proxy, options) => {
					proxy.on('proxyReq', (proxyReq, req, res) => {
						// 移除可能导致跨域问题的请求头
						proxyReq.removeHeader('referer');
						proxyReq.removeHeader('origin');
					});
					proxy.on('proxyRes', (proxyRes, req, res) => {
						// 设置正确的 CORS 响应头
						proxyRes.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:9001';
						proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE';
						proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
						proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
					});
				},
			},
		}
	},
})

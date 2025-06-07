import { ConfigProvider } from 'antd'
import { createRoot } from 'react-dom/client'
import 'virtual:uno.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
	<ConfigProvider theme={{ token: { colorPrimary: '#FD8204' }}}>
		<App />
	</ConfigProvider>
)

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'
import { autoDownload } from './lib/offlineCache'

registerSW({ immediate: true })
autoDownload() // saves all media in the background so the app also works fully offline

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <App />
  // </StrictMode>,
)

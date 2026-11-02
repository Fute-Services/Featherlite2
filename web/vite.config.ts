import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, extname, sep } from 'node:path'

// After the build, list every heavy file (images, videos, PDF, panoramas) plus the
// remote CDN images referenced in the source. The app's "Download for offline"
// button walks this list and stores everything in the cache.
function offlineManifest(): Plugin {
  return {
    name: 'fl-offline-manifest',
    apply: 'build',
    closeBundle() {
      const dist = join(process.cwd(), 'dist')
      const skip = new Set(['.js', '.css', '.html', '.map', '.mjs'])
      const files: { url: string; size: number }[] = []
      const walk = (dir: string) => {
        for (const name of readdirSync(dir)) {
          const p = join(dir, name)
          const st = statSync(p)
          if (st.isDirectory()) { walk(p); continue }
          const rel = relative(dist, p).split(sep).join('/')
          if (skip.has(extname(name).toLowerCase())) continue
          if (/^(sw|workbox-|manifest|offline-manifest|registerSW)/.test(rel) || rel.startsWith('icons-pwa/') || rel === '_redirects') continue
          files.push({ url: '/' + encodeURI(rel), size: st.size })
        }
      }
      walk(dist)

      const remote = new Set<string>()
      const walkSrc = (dir: string) => {
        for (const name of readdirSync(dir)) {
          const p = join(dir, name)
          if (statSync(p).isDirectory()) { walkSrc(p); continue }
          if (!/\.(tsx?|css)$/.test(name)) continue
          const text = readFileSync(p, 'utf8')
          for (const m of text.matchAll(/https:\/\/(?:res\.cloudinary\.com|imagedelivery\.net)\/[^"'`\s)\\]+/g)) {
            // skip template fragments such as ".../vr/${slug}/orig" and bare base paths
            if (!m[0].includes('${') && !/\/assets\/featherlite(?:\/media)?$/.test(m[0])) remote.add(m[0])
          }
          // VR panoramas: cf('slug') in tourData.ts expands to a CDN url
          for (const m of text.matchAll(/\bcf\('([^']+)'\)/g)) {
            remote.add(`https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/vr/${m[1]}/orig`)
          }
        }
      }
      walkSrc(join(process.cwd(), 'src'))

      writeFileSync(
        join(dist, 'offline-manifest.json'),
        JSON.stringify({ built: Date.now(), files, remote: [...remote].map((url) => ({ url, size: 0 })) }),
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'sw',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectRegister: false,
      manifest: {
        name: 'Featherlite Signature',
        short_name: 'Featherlite',
        description: 'Featherlite Signature - interactive project presentation',
        start_url: '/',
        scope: '/',
        display: 'fullscreen',
        display_override: ['fullscreen', 'standalone'],
        orientation: 'landscape',
        background_color: '#062033',
        theme_color: '#062033',
        icons: [
          { src: '/icons-pwa/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons-pwa/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons-pwa/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      injectManifest: {
        // app shell only; the heavy media goes through the runtime cache
        globPatterns: ['**/*.{js,mjs,css,html,svg,woff,woff2}', 'icons-pwa/*.png', 'favicon.svg'],
        globIgnores: ['**/node_modules/**'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
    }),
    offlineManifest(),
  ],
})

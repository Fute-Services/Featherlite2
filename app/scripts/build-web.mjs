/**
 * Builds the web project (../web) into app/www with the offline rewrites
 * applied. Vite, React and Tailwind are loaded out of web/node_modules so the
 * app never drifts from the versions the website is built with.
 */
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { offlineAssets } from './offline-plugin.mjs'
import { appUi } from './app-ui-plugin.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const APP = path.resolve(HERE, '..')
const WEB = path.resolve(APP, '..', 'web')

const requireFromWeb = createRequire(path.join(WEB, 'package.json'))
const loadFromWeb = async (id) => import(pathToFileURL(requireFromWeb.resolve(id)).href)

const { build } = await loadFromWeb('vite')
const react = (await loadFromWeb('@vitejs/plugin-react')).default
const tailwindcss = (await loadFromWeb('@tailwindcss/vite')).default

const APP_RUNTIME = path.join(APP, 'src', 'app-runtime.ts')

/** Pulls the Android-only runtime (back button, immersive mode) into the bundle. */
const appRuntime = {
  name: 'featherlite-app-runtime',
  transform(code, id) {
    if (!id.endsWith(path.join('src', 'main.tsx')) && !id.endsWith('src/main.tsx')) return null
    return {
      code: `import ${JSON.stringify(pathToFileURL(APP_RUNTIME).pathname)}\n${code}`,
      map: null,
    }
  },
}

await build({
  root: WEB,
  configFile: false,
  plugins: [
    appUi({ appDir: APP, webDir: WEB }),
    offlineAssets({ appDir: APP, webDir: WEB }),
    react(),
    tailwindcss(),
    appRuntime,
  ],
  resolve: {
    // the runtime lives in app/src and imports Capacitor from app/node_modules
    preserveSymlinks: false,
  },
  build: {
    outDir: path.join(APP, 'www'),
    emptyOutDir: true,
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 4000,
    // no need to shave bytes off a locally packaged app, and readable output
    // makes the "did anything stay remote?" audit meaningful
    sourcemap: false,
  },
})

console.log('\nweb build -> app/www')

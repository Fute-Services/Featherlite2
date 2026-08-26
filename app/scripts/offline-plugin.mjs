/**
 * Vite plugin used only by the Android build. It takes the untouched web/
 * sources and rewires every remote URL to the copy mirrored under app/offline/,
 * so the packaged app renders byte-identically to the website with no network.
 *
 * The web project itself is never modified - the rewrite happens in memory
 * during the app build.
 */
import fs from 'node:fs/promises'
import path from 'node:path'

const CODE_EXT = /\.(tsx?|jsx?|mjs|css|json)($|\?)/

/** Hosts that must not survive into the app bundle. */
export const MIRRORED_HOSTS = [
  'imagedelivery.net',
  'res.cloudinary.com',
  'images.unsplash.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
]

/** Remote URLs that stay remote on purpose (documented online-only features). */
const ALLOWED_REMOTE = ['www.youtube.com', 'featherlitebackend.onrender.com']

/** Where mirror-location-tour.mjs puts the mirrored Pano2VR tour. */
const LOCATION_TOUR = '/offline/location-tour/index.html'

export function offlineAssets({ appDir, webDir }) {
  let manifest
  let urlsLongestFirst = []
  let tourMirrored = false
  const hits = new Map()
  const misses = new Set()

  return {
    name: 'featherlite-offline-assets',
    enforce: 'pre',

    async buildStart() {
      const raw = await fs.readFile(path.join(appDir, 'offline', 'manifest.json'), 'utf8')
      manifest = JSON.parse(raw)
      urlsLongestFirst = Object.keys(manifest.urls).sort((a, b) => b.length - a.length)
      tourMirrored = await fs
        .stat(path.join(appDir, 'offline', 'location-tour', 'index.html'))
        .then(
          () => true,
          () => false,
        )
      if (!tourMirrored) {
        console.warn(
          '[offline] app/offline/location-tour is missing - run scripts/mirror-location-tour.mjs, ' +
            'otherwise the Location page is blank without a network',
        )
      }
    },

    transform(code, id) {
      if (!CODE_EXT.test(id)) return null
      if (id.includes('node_modules')) return null

      let out = code
      let touched = false

      // 0. Google Fonts @import: dropped here and re-added to index.html as a
      //    <link> pointing at the mirrored sheet (an @import of an absolute
      //    /offline path is not resolvable at build time).
      if (out.includes('fonts.googleapis.com')) {
        const stripped = out
          .replace(
            /@import\s+url\(\s*["']?https:\/\/fonts\.googleapis\.com\/css2\?[^"')]+["']?\s*\)\s*;?/g,
            '',
          )
          .replace(/@import\s+["']https:\/\/fonts\.googleapis\.com\/css2\?[^"']+["']\s*;?/g, '')
        if (stripped !== out) {
          out = stripped
          touched = true
        }
      }

      // 0b. the Location page iframes a Pano2VR tour hosted on another domain
      if (tourMirrored && out.includes('futeservices.com')) {
        const swapped = out.replace(
          /(["'`])https?:\/\/[^"'`]*futeservices\.com[^"'`]*index\.html\1/g,
          JSON.stringify(LOCATION_TOUR),
        )
        if (swapped !== out) {
          out = swapped
          touched = true
        }
      }

      // 1. plain literal URLs
      for (const url of urlsLongestFirst) {
        if (!out.includes(url)) continue
        out = out.split(url).join(manifest.urls[url])
        hits.set(url, (hits.get(url) || 0) + 1)
        touched = true
      }

      // 2. template literals built from a base const, e.g. `${CF}/home/x/web2560`
      const bases = new Map()
      for (const m of code.matchAll(/const\s+([A-Z_][A-Z0-9_]*)\s*=\s*["'](https?:\/\/[^"']+)["']/g)) {
        bases.set(m[1], m[2])
      }
      if (bases.size) {
        out = out.replace(/\$\{([A-Z_][A-Z0-9_]*)\}([^`"'\s)]*)/g, (whole, name, rest) => {
          const base = bases.get(name)
          if (!base) return whole
          const local = manifest.urls[base + rest]
          if (!local) {
            if (MIRRORED_HOSTS.some((h) => base.includes(h))) misses.add(base + rest)
            return whole
          }
          touched = true
          hits.set(base + rest, (hits.get(base + rest) || 0) + 1)
          return local
        })
      }

      // 3. pdf.js worker is resolved from the installed pdfjs-dist version at
      //    runtime, so it never appears as a literal URL.
      if (manifest.pdf && out.includes('pdfjs-dist@')) {
        out = out.replace(
          /["'`]https:\/\/(?:unpkg\.com|cdn\.jsdelivr\.net)\/[^"'`]*pdf\.worker[^"'`]*["'`]/g,
          JSON.stringify(manifest.pdf.local),
        )
        touched = true
      }

      return touched ? { code: out, map: null } : null
    },

    /** Swap the Google Fonts <link> for the mirrored stylesheet. */
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        let out = html
        if (manifest.fonts?.sheets?.length) {
          out = out.replace(/<link[^>]+fonts\.googleapis\.com\/css2[^>]*>\s*/g, '')
          out = out.replace(/<link[^>]+rel="preconnect"[^>]*>\s*/g, '')
          const links = manifest.fonts.sheets
            .map((s) => `<link rel="stylesheet" href="${s.local}" />`)
            .join('\n  ')
          out = out.replace('</head>', `  ${links}\n</head>`)
        }
        // the favicon points at a source path that only exists in dev
        out = out.replace(/<link rel="icon"[^>]*>/, '<link rel="icon" href="/favicon.svg" />')
        return out
      },
    },

    /** Copy the mirrored files next to the build output. */
    async closeBundle() {
      const from = path.join(appDir, 'offline')
      const to = path.join(appDir, 'www', 'offline')
      await fs.rm(to, { recursive: true, force: true })
      await fs.cp(from, to, { recursive: true })

      // Fail loudly if anything still points at a mirrored host.
      const leftovers = await scanForRemoteHosts(path.join(appDir, 'www'))
      const unexpected = leftovers.filter((l) => !ALLOWED_REMOTE.some((h) => l.url.includes(h)))

      console.log(`\n[offline] rewrote ${hits.size} remote URLs to local copies`)
      if (misses.size) {
        console.warn(`[offline] ${misses.size} templated URLs had no mirror:`)
        for (const m of misses) console.warn(`  ${m}`)
      }
      if (unexpected.length) {
        console.warn(`[offline] ${unexpected.length} remote references survived the build:`)
        for (const l of unexpected.slice(0, 20)) console.warn(`  ${l.file}: ${l.url}`)
        throw new Error('offline build incomplete - remote asset URLs remain in the bundle')
      }
      console.log('[offline] bundle is fully self-contained (except documented online-only embeds)')

      await prunePublicAssets(path.join(appDir, 'www'), path.join(webDir, 'public'))
    },
  }
}

/**
 * web/public carries several superseded generations of the same panoramas
 * (public/vr is not referenced at all, and "virtual tour" holds .jpeg/.png/.jpg
 * versions of every camera while the code only loads the .jpg ones). Shipping
 * all of it would triple the APK for files the app never opens, so anything the
 * built bundle does not mention by name is dropped from the packaged copy.
 * web/public itself is untouched - the website keeps every file it has today.
 */
async function prunePublicAssets(wwwDir, publicDir) {
  const bundleText = []
  for (const file of await listFiles(wwwDir)) {
    if (!/\.(js|mjs|css|html|json)$/.test(file)) continue
    if (path.relative(wwwDir, file).startsWith('offline')) continue
    bundleText.push(await fs.readFile(file, 'utf8'))
  }
  const haystack = bundleText.join('\n')

  const publicFiles = await listFiles(publicDir)
  let keptBytes = 0
  let droppedBytes = 0
  const dropped = []

  for (const src of publicFiles) {
    const rel = path.relative(publicDir, src).split(path.sep).join('/')
    const copied = path.join(wwwDir, rel)
    if (!(await fileExists(copied))) continue

    const base = path.basename(rel)
    const dir = path.posix.dirname(rel)
    // Paths are usually assembled at runtime ("/virtual tour/" + name), so a
    // file counts as used only when its own directory is also mentioned -
    // otherwise public/vr, which repeats every panorama filename, looks used.
    const dirUsed =
      dir === '.' ||
      haystack.includes(`/${dir}/`) ||
      haystack.includes(encodeURI(`/${dir}/`))
    // a bare basename match is far too loose ("1.png" hits any bundle), so the
    // name has to appear as a complete string literal
    const quoted = (name) => ['"', "'", '`'].some((q) => haystack.includes(`${q}${name}${q}`))
    const referenced =
      haystack.includes(rel) ||
      haystack.includes(encodeURI(rel)) ||
      (dirUsed && (quoted(base) || quoted(encodeURIComponent(base)))) ||
      // _redirects / favicon and friends are infrastructure, never referenced
      /^(_redirects|favicon\.svg|icons\.svg)$/.test(rel)

    const { size } = await fs.stat(copied)
    if (referenced) {
      keptBytes += size
    } else {
      await fs.rm(copied)
      droppedBytes += size
      dropped.push(rel)
    }
  }

  await removeEmptyDirs(wwwDir)

  const mb = (n) => `${(n / 1024 / 1024).toFixed(0)} MB`
  console.log(
    `[prune] kept ${mb(keptBytes)} of public assets, dropped ${dropped.length} unreferenced files (${mb(droppedBytes)})`,
  )
  for (const rel of dropped) console.log(`  - ${rel}`)
}

async function listFiles(dir, acc = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) await listFiles(full, acc)
    else acc.push(full)
  }
  return acc
}

async function fileExists(p) {
  return fs.stat(p).then(
    () => true,
    () => false,
  )
}

async function removeEmptyDirs(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const full = path.join(dir, entry.name)
    await removeEmptyDirs(full)
    if ((await fs.readdir(full)).length === 0) await fs.rmdir(full)
  }
}

async function scanForRemoteHosts(dir) {
  const found = []
  const hostPattern = new RegExp(
    `https?://(?:${MIRRORED_HOSTS.map((h) => h.replace(/\./g, '\\.')).join('|')})[^"'\\s)\\\\]*`,
    'g',
  )
  const stack = [dir]
  while (stack.length) {
    const current = stack.pop()
    for (const entry of await fs.readdir(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (entry.name !== 'offline') stack.push(full)
        continue
      }
      if (!/\.(js|mjs|css|html|json)$/.test(entry.name)) continue
      const text = await fs.readFile(full, 'utf8')
      for (const m of text.matchAll(hostPattern)) {
        found.push({ file: path.relative(dir, full), url: m[0] })
      }
    }
  }
  return found
}

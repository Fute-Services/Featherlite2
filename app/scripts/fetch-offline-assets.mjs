/**
 * Mirrors every remote asset the website loads into app/offline/ so the APK
 * renders identically with no network. Produces offline/manifest.json mapping
 * the original absolute URL -> the local path the app build should use.
 *
 * Re-runnable: already-downloaded files are skipped unless --force is passed.
 */
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const APP = path.resolve(HERE, '..')
const WEB = path.resolve(APP, '..', 'web')
const OUT = path.join(APP, 'offline')
const FORCE = process.argv.includes('--force')

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

/** Hosts whose assets get mirrored. Anything else stays untouched. */
const MIRRORED_HOSTS = new Set([
  'imagedelivery.net',
  'res.cloudinary.com',
  'images.unsplash.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
])

const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'video/mp4': '.mp4',
  'text/css': '.css',
  'application/javascript': '.js',
  'text/javascript': '.js',
  'font/woff2': '.woff2',
  'font/woff': '.woff',
  'font/ttf': '.ttf',
}

/* ------------------------------------------------------------------ */
/* 1. Collect every remote URL referenced by the web source            */
/* ------------------------------------------------------------------ */

async function walk(dir, acc = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) await walk(full, acc)
    else acc.push(full)
  }
  return acc
}

const TEXT_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.html'])

async function collectUrls() {
  const files = [...(await walk(path.join(WEB, 'src'))), path.join(WEB, 'index.html')].filter(
    (f) => TEXT_EXT.has(path.extname(f)),
  )

  const urls = new Set()
  // `const CF = "https://..."` style bases that later get template-concatenated
  const bases = new Map()

  for (const file of files) {
    const text = await fs.readFile(file, 'utf8')

    for (const m of text.matchAll(/https?:\/\/[^\s"'`)\\]+/g)) {
      const raw = m[0].replace(/[.,;]+$/, '')
      let u
      try {
        u = new URL(raw)
      } catch {
        continue
      }
      if (MIRRORED_HOSTS.has(u.hostname)) urls.add(u.toString())
    }

    // template bases: const CF = "https://imagedelivery.net/.../featherlite"
    for (const m of text.matchAll(/const\s+([A-Z_][A-Z0-9_]*)\s*=\s*["'](https?:\/\/[^"']+)["']/g)) {
      bases.set(m[1], m[2])
    }
    // `${CF}/home/signature-sunset/web2560`
    for (const m of text.matchAll(/\$\{([A-Z_][A-Z0-9_]*)\}([^`"'\s)]*)/g)) {
      const base = bases.get(m[1])
      if (!base) continue
      const full = base + m[2]
      try {
        if (MIRRORED_HOSTS.has(new URL(full).hostname)) urls.add(full)
      } catch {
        /* not a URL */
      }
    }
  }
  // Two kinds of match are never assets: the base constants themselves
  // (`const CF = "https://.../featherlite"`, only ever concatenated) and
  // fragments of an unresolved template such as `pdfjs-dist@${pdfjs.version}`.
  const baseValues = new Set(bases.values())
  const assets = [...urls].filter((u) => {
    if (baseValues.has(u)) return false
    if (u.includes('${') || u.includes('%7B')) return false
    return new URL(u).pathname.replace(/^\/+|\/+$/g, '').length > 0
  })

  return { urls: assets.sort(), bases }
}

/* ------------------------------------------------------------------ */
/* 2. Download                                                         */
/* ------------------------------------------------------------------ */

function slugFor(u) {
  const url = new URL(u)
  const host = url.hostname.replace(/[^a-z0-9.-]/gi, '_')
  const clean = decodeURIComponent(url.pathname)
    .replace(/^\/+/, '')
    .replace(/[^a-zA-Z0-9._/-]/g, '_')
  const hash = createHash('sha1').update(u).digest('hex').slice(0, 8)
  const ext = path.extname(clean)
  const stem = ext ? clean.slice(0, -ext.length) : clean
  return { host, stem: `${stem}-${hash}`, ext }
}

async function download(url, attempt = 1) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept: '*/*' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const mime = (res.headers.get('content-type') || '').split(';')[0].trim()
    return { buf, mime }
  } catch (err) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 500 * attempt))
      return download(url, attempt + 1)
    }
    throw err
  }
}

async function exists(p) {
  return fs.stat(p).then(
    () => true,
    () => false,
  )
}

async function mirror(urls) {
  const manifest = {}
  const failures = []
  let done = 0

  const queue = [...urls]
  const workers = Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const url = queue.shift()
      const { host, stem, ext } = slugFor(url)
      try {
        const { buf, mime } = await download(url)
        const finalExt = ext || EXT_BY_MIME[mime] || '.bin'
        const rel = path.posix.join(host, `${stem}${finalExt}`)
        const dest = path.join(OUT, rel)
        await fs.mkdir(path.dirname(dest), { recursive: true })
        if (FORCE || !(await exists(dest))) await fs.writeFile(dest, buf)
        manifest[url] = `/offline/${rel}`
      } catch (err) {
        failures.push({ url, error: String(err.message || err) })
      }
      process.stdout.write(`\r  ${++done}/${urls.length} mirrored`)
    }
  })
  await Promise.all(workers)
  process.stdout.write('\n')
  return { manifest, failures }
}

/* ------------------------------------------------------------------ */
/* 3. Google Fonts -> local @font-face                                 */
/* ------------------------------------------------------------------ */

async function mirrorGoogleFonts() {
  // Google Fonts are pulled in two ways: a <link> in index.html and an @import
  // inside index.css. Both have to become local stylesheets.
  const sources = [
    ...(await walk(path.join(WEB, 'src'))).filter((f) => TEXT_EXT.has(path.extname(f))),
    path.join(WEB, 'index.html'),
  ]

  const sheetUrls = new Set()
  for (const file of sources) {
    const text = await fs.readFile(file, 'utf8')
    for (const m of text.matchAll(/https:\/\/fonts\.googleapis\.com\/css2\?[^"')\s]+/g)) {
      sheetUrls.add(m[0].replace(/&amp;/g, '&'))
    }
  }
  if (!sheetUrls.size) return null

  const dir = path.join(OUT, 'fonts')
  await fs.mkdir(dir, { recursive: true })

  const sheets = []
  let fileCount = 0

  for (const cssUrl of sheetUrls) {
    const res = await fetch(cssUrl, { headers: { 'user-agent': UA } })
    let css = await res.text()

    const fontUrls = [
      ...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)].map((m) => m[1])),
    ]
    for (const url of fontUrls) {
      const name =
        createHash('sha1').update(url).digest('hex').slice(0, 12) + path.extname(new URL(url).pathname)
      const dest = path.join(dir, name)
      if (FORCE || !(await exists(dest))) {
        const r = await fetch(url, { headers: { 'user-agent': UA } })
        await fs.writeFile(dest, Buffer.from(await r.arrayBuffer()))
      }
      // absolute so the sheet works from any URL the webview loads it at
      css = css.split(url).join(`/offline/fonts/${name}`)
      fileCount += 1
    }

    const sheetName = `sheet-${createHash('sha1').update(cssUrl).digest('hex').slice(0, 10)}.css`
    await fs.writeFile(path.join(dir, sheetName), css)
    sheets.push({ url: cssUrl, local: `/offline/fonts/${sheetName}` })
  }

  console.log(`  fonts: ${sheets.length} stylesheets, ${fileCount} font files -> offline/fonts/`)
  return { sheets }
}

/* ------------------------------------------------------------------ */
/* 4. pdf.js worker (react-pdf) straight out of node_modules           */
/* ------------------------------------------------------------------ */

async function copyPdfWorker() {
  const candidates = ['pdfjs-dist/build/pdf.worker.min.mjs', 'pdfjs-dist/legacy/build/pdf.worker.min.mjs']
  for (const rel of candidates) {
    const src = path.join(WEB, 'node_modules', rel)
    if (await exists(src)) {
      // served through the Capacitor asset loader, which has no MIME mapping
      // for .mjs - an unnamed type makes the WebView refuse the module worker
      const dest = path.join(OUT, 'pdf', 'pdf.worker.min.js')
      await fs.mkdir(path.dirname(dest), { recursive: true })
      // The worker runs in its own global scope, so the URL.parse shim the app
      // installs on the main thread does not reach it. Without this the worker
      // throws while parsing annotations on pre-Chrome-126 WebViews.
      const shim =
        'if(typeof URL.parse!=="function"){URL.parse=function(u,b){try{' +
        'return b===undefined?new URL(u):new URL(u,b)}catch(e){return null}};}\n' +
        'if(typeof URL.canParse!=="function"){URL.canParse=function(u,b){' +
        'return URL.parse(u,b)!==null};}\n'
      await fs.writeFile(dest, shim + (await fs.readFile(src, 'utf8')))
      const version = JSON.parse(
        await fs.readFile(path.join(WEB, 'node_modules', 'pdfjs-dist', 'package.json'), 'utf8'),
      ).version
      console.log(`  pdf.js worker ${version} -> offline/pdf/pdf.worker.min.js`)
      return { version, local: '/offline/pdf/pdf.worker.min.js' }
    }
  }
  console.warn('  ! pdfjs-dist worker not found in web/node_modules')
  return null
}

/* ------------------------------------------------------------------ */

const { urls } = await collectUrls()
console.log(`Found ${urls.length} remote asset URLs in web/src`)
await fs.mkdir(OUT, { recursive: true })

const { manifest, failures } = await mirror(urls)
const fonts = await mirrorGoogleFonts()
const pdf = await copyPdfWorker()

await fs.writeFile(
  path.join(OUT, 'manifest.json'),
  JSON.stringify({ generated: new Date().toISOString(), urls: manifest, fonts, pdf, failures }, null, 2),
)

console.log(`\nMirrored ${Object.keys(manifest).length}/${urls.length} assets into app/offline/`)
if (failures.length) {
  console.log(`\n${failures.length} FAILED:`)
  for (const f of failures) console.log(`  ${f.url}\n    ${f.error}`)
  process.exitCode = 1
}

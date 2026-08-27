/**
 * The Location page embeds a Pano2VR tour hosted on futeservices.com. An
 * offline app cannot reach it, so the whole tour - player, skin, config and
 * every cube-face tile - is mirrored into app/offline/location-tour/ and the
 * app build points the iframe there instead.
 *
 * Run after fetch-offline-assets.mjs; re-runnable (skips files already saved).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const APP = path.resolve(HERE, '..')
const WEB = path.resolve(APP, '..', 'web')
const OUT = path.join(APP, 'offline', 'location-tour')
const FORCE = process.argv.includes('--force')

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

/** Reads the tour URL out of the web source so the two never drift apart. */
async function findTourUrl() {
  const file = path.join(WEB, 'src', 'Pages', 'Location.tsx')
  const text = await fs.readFile(file, 'utf8')
  const m = text.match(/['"`](https?:\/\/[^'"`]+\/index\.html)['"`]/)
  if (!m) throw new Error(`no tour URL found in ${file}`)
  return m[1]
}

const tourUrl = await findTourUrl()
const BASE = tourUrl.replace(/index\.html$/, '')
console.log(`Mirroring ${tourUrl}`)

async function exists(p) {
  return fs.stat(p).then(
    () => true,
    () => false,
  )
}

/** Downloads BASE + rel into OUT/rel. Returns the body for text files. */
async function grab(rel, { optional = false } = {}) {
  const clean = rel.split('?')[0]
  const dest = path.join(OUT, clean)
  if (!FORCE && (await exists(dest))) {
    return fs.readFile(dest)
  }
  const res = await fetch(BASE + rel, { headers: { 'user-agent': UA } })
  if (!res.ok) {
    if (optional) return null
    throw new Error(`${rel} -> HTTP ${res.status}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.mkdir(path.dirname(dest), { recursive: true })
  await fs.writeFile(dest, buf)
  return buf
}

await fs.mkdir(OUT, { recursive: true })

/* ---- core files ---------------------------------------------------- */

let html = (await grab('index.html')).toString('utf8')
// the cache-busting query would survive into the packaged app, where the asset
// loader serves by path only
html = html.replace(/\?ts=\d+/g, '')
await fs.writeFile(path.join(OUT, 'index.html'), html)

const player = (await grab('pano2vr_player.js')).toString('utf8')
const skin = (await grab('skin.js')).toString('utf8')
const xml = (await grab('pano.xml')).toString('utf8')
await grab('preview.jpg', { optional: true })
console.log('  player, skin and config saved')

/* ---- flat assets referenced from the skin / config ------------------ */

const flat = new Set()
for (const source of [html, skin, xml, player]) {
  for (const m of source.matchAll(
    /["'`]((?:images|media|audio|videos|assets)\/[A-Za-z0-9_./-]+\.[A-Za-z0-9]{2,5})["'`]/g,
  )) {
    flat.add(m[1])
  }
}

let flatOk = 0
for (const rel of flat) {
  if (await grab(rel, { optional: true })) flatOk += 1
}
console.log(`  ${flatOk}/${flat.size} skin assets saved`)

/* ---- panorama tiles ------------------------------------------------- */

/**
 * Pano2VR names tiles by a template like
 *   tiles/node2/cf_%c/l_%l/c_%x/tile_%y.jpg
 * with one cube face per %c and one grid per level. The level list gives the
 * pixel size of each level, and leveltilesize the tile edge, which is all that
 * is needed to enumerate the grid.
 */
/** Pano2VR writes cube faces either as f/b/l/r/u/d or as 0..5 - probe once. */
async function detectFaces(template) {
  for (const set of [
    ['0', '1', '2', '3', '4', '5'],
    ['f', 'b', 'l', 'r', 'u', 'd'],
  ]) {
    const probe = template
      .replace('%c', set[0])
      .replace('%l', '0')
      .replace('%x', '0')
      .replace('%y', '0')
    const res = await fetch(BASE + probe, { method: 'HEAD', headers: { 'user-agent': UA } })
    if (res.ok) return set
  }
  return null
}

let tileCount = 0
let tileMissing = 0

for (const pano of xml.matchAll(/<input\b[^>]*>/g)) {
  const tag = pano[0]
  const template = tag.match(/leveltileurl="([^"]+)"/)?.[1]
  const tileSize = Number(tag.match(/leveltilesize="(\d+)"/)?.[1] || 0)
  if (!template || !tileSize) continue

  // the <level> entries follow the <input> tag, largest first
  const after = xml.slice(pano.index)
  const block = after.slice(0, after.indexOf('</input>') + 1)
  const levels = [...block.matchAll(/<level width="(\d+)"/g)].map((m) => Number(m[1]))
  if (!levels.length) continue

  const faces = await detectFaces(template)
  if (!faces) {
    console.warn(`  ! could not work out the tile naming for ${template}`)
    continue
  }

  // Which level index holds which resolution is not stated anywhere, so every
  // level is enumerated at the largest grid and misses are simply skipped.
  const maxGrid = Math.ceil(Math.max(...levels) / tileSize)
  const jobs = []
  levels.forEach((_width, level) => {
    const grid = maxGrid
    for (const face of faces) {
      for (let x = 0; x < grid; x += 1) {
        for (let y = 0; y < grid; y += 1) {
          jobs.push(
            template
              .replace('%c', face)
              .replace('%l', String(level))
              .replace('%x', String(x))
              .replace('%y', String(y)),
          )
        }
      }
    }
  })

  console.log(`  ${jobs.length} tiles for ${template.split('/')[1] || 'panorama'}...`)

  const queue = [...jobs]
  await Promise.all(
    Array.from({ length: 12 }, async () => {
      while (queue.length) {
        const rel = queue.shift()
        const got = await grab(rel, { optional: true })
        if (got) tileCount += 1
        else tileMissing += 1
        if ((tileCount + tileMissing) % 25 === 0) {
          process.stdout.write(`\r    ${tileCount + tileMissing}/${jobs.length}`)
        }
      }
    }),
  )
  process.stdout.write('\n')
}

const total = await folderSize(OUT)
console.log(
  `\nLocation tour mirrored: ${tileCount} tiles (${tileMissing} not present), ${(total / 1024 / 1024).toFixed(0)} MB in app/offline/location-tour/`,
)

if (tileCount === 0) {
  console.warn('! no tiles were downloaded - the Location page will be blank offline')
  process.exitCode = 1
}

async function folderSize(dir) {
  let sum = 0
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) sum += await folderSize(full)
    else sum += (await fs.stat(full)).size
  }
  return sum
}

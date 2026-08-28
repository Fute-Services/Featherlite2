/**
 * Vite plugin used only by the Android build. It swaps two pieces of the
 * website's UI for app-specific ones, in memory, during the app build.
 *
 * The web project is never modified - same contract as offline-plugin.mjs. A
 * change to the site still reaches the app by rebuilding, and the website keeps
 * behaving exactly as it does today.
 *
 * What it swaps, and why the app needs something different:
 *
 * 1. `Media.tsx` - the walk-through YouTube iframe. A browser has a network; a
 *    tablet in airplane mode does not, and the iframe never fires load, so the
 *    spinner behind it span forever. The app plays a bundled film when one is
 *    packaged and says something useful when it cannot.
 * 2. `Router.tsx` - wraps the routed screens in an error boundary. A browser
 *    can recover from a white page with the reload button; a kiosk tablet with
 *    no system bars cannot.
 *
 * Each patch is an exact string replacement and the build **fails** if the text
 * it expects is gone. A change on the website can then never silently drop an
 * app fix - it stops the build and asks to be looked at.
 */
import fs from 'node:fs/promises'
import path from 'node:path'

/** Where the app's own components live. */
const UI_DIR = ['src', 'ui']
/**
 * The components are compiled as if they sat in web/src/__app-ui__/, a folder
 * that exists nowhere on disk. That is what lets them `import "react"` and
 * `import "../assets/..."` and have both resolve against the website, without
 * a single file being written into web/.
 */
const VIRTUAL_DIR = '__app-ui__'

const norm = (p) => p.split(path.sep).join('/')

/** One patch: the file it applies to, the text it needs, and what replaces it. */
const PATCHES = [
  {
    file: 'src/Pages/Media.tsx',
    what: 'the walk-through YouTube iframe',
    find: `              {/* sits behind the iframe so the frame is never an empty black box */}
              <span className="absolute inset-0 z-0 flex items-center justify-center">
                <span className="size-9 animate-spin rounded-full border-2 border-white/15 border-t-[#C89D54]" />
              </span>
              <iframe
                src="https://www.youtube.com/embed/CgHy7kYATNo?autoplay=1&rel=0&playsinline=1"
                className="relative z-10 h-full w-full flex-1 border-none"
                title="Walkthrough Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />`,
    replace: `              <WalkthroughPlayer />`,
    prepend: `import WalkthroughPlayer from "../${VIRTUAL_DIR}/WalkthroughModal";\n`,
  },
  {
    file: 'src/Routs/Router.tsx',
    what: 'the router crash guard',
    find: `      <Suspense fallback={null}>`,
    replace: `      <AppErrorBoundary>
      <Suspense fallback={null}>`,
    prepend: `import AppErrorBoundary from "../${VIRTUAL_DIR}/ErrorBoundary";\n`,
  },
  {
    file: 'src/Routs/Router.tsx',
    what: 'the router crash guard (closing tag)',
    find: `      </Suspense>`,
    replace: `      </Suspense>
      </AppErrorBoundary>`,
  },
]

export function appUi({ appDir, webDir }) {
  const virtualRoot = norm(path.join(webDir, 'src', VIRTUAL_DIR))
  const applied = new Set()

  return {
    name: 'featherlite-app-ui',
    enforce: 'pre',

    /* Point the fake web/src/__app-ui__/* path at itself so Vite stops looking
       for it on disk and hands it to load() below. */
    resolveId(source, importer) {
      if (!source.includes(VIRTUAL_DIR)) return null
      const abs = importer
        ? path.resolve(path.dirname(importer), source)
        : path.resolve(webDir, 'src', source)
      const id = norm(abs)
      return id.endsWith('.tsx') ? id : `${id}.tsx`
    },

    load(id) {
      const clean = norm(id.split('?')[0])
      if (!clean.startsWith(virtualRoot)) return null
      const name = path.basename(clean)
      return fs.readFile(path.join(appDir, ...UI_DIR, name), 'utf8')
    },

    transform(code, id) {
      const clean = norm(id.split('?')[0])
      /* The checkout on a Windows box hands these files back with CRLF, which
         no amount of care in the patch literals below would survive. Match and
         emit LF; the bundler does not care either way. */
      let out = code.replace(/\r\n/g, '\n')
      let touched = false

      for (const patch of PATCHES) {
        if (!clean.endsWith(`web/${patch.file}`)) continue
        if (!out.includes(patch.find)) {
          throw new Error(
            `[app-ui] cannot patch ${patch.what} - the text it replaces is no ` +
              `longer in ${patch.file}. The website changed; update PATCHES in ` +
              `scripts/app-ui-plugin.mjs to match, or the app ships without ` +
              `this fix.`,
          )
        }
        out = out.replace(patch.find, patch.replace)
        if (patch.prepend && !out.includes(patch.prepend)) out = patch.prepend + out
        applied.add(patch.what)
        touched = true
      }

      return touched ? { code: out, map: null } : null
    },

    buildEnd() {
      const wanted = new Set(PATCHES.map((p) => p.what))
      const missing = [...wanted].filter((w) => !applied.has(w))
      if (missing.length) {
        this.error(
          `[app-ui] these patches never ran: ${missing.join(', ')}. The files ` +
            `they target were not part of the build.`,
        )
      }
      console.log(`[app-ui] applied ${applied.size} app-only UI patches`)
    },
  }
}

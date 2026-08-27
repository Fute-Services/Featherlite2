/**
 * Android-only behaviour, injected into the bundle by the app build.
 * It never touches layout or styling - the web UI is rendered exactly as the
 * website renders it. Everything here is about making that UI behave like an
 * app: hardware back navigation, immersive full screen, no browser gestures.
 */
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { StatusBar } from '@capacitor/status-bar'

/* A browser gets whatever Chrome the user has; a packaged app gets whatever
   Android System WebView the tablet shipped with, which on an offline device is
   never updated. pdf.js (the brochure flipbook) calls URL.parse/URL.canParse,
   added in Chrome 126, so on an older WebView the brochure fails to open. These
   are the spec definitions, installed only when the runtime lacks them. */
type URLStatics = typeof URL & {
  parse?: (url: string | URL, base?: string | URL) => URL | null
  canParse?: (url: string | URL, base?: string | URL) => boolean
}
const urlStatics = URL as URLStatics

if (typeof urlStatics.parse !== 'function') {
  urlStatics.parse = (url, base) => {
    try {
      return base === undefined ? new URL(url) : new URL(url, base)
    } catch {
      return null
    }
  }
}

if (typeof urlStatics.canParse !== 'function') {
  urlStatics.canParse = (url, base) => urlStatics.parse!(url, base) !== null
}

if (Capacitor.isNativePlatform()) {
  /* Hardware back button follows the router; at the home screen it backgrounds
     the app instead of leaving a blank webview. */
  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack && window.location.pathname !== '/') {
      window.history.back()
    } else {
      void App.minimizeApp()
    }
  })

  /* Full-bleed presentation: the site is designed edge to edge. */
  void StatusBar.hide().catch(() => {})

  /* Long-press on an image pops a "save image" sheet in a webview - not
     something an app should do. Text selection is off for the same reason. */
  document.addEventListener('contextmenu', (event) => event.preventDefault())

  /* Double-tap zoom and pinch zoom would break the fixed presentation layout. */
  document.addEventListener(
    'gesturestart',
    (event) => event.preventDefault(),
    { passive: false },
  )

  const style = document.createElement('style')
  style.textContent = `
    html, body {
      -webkit-user-select: none;
      user-select: none;
      -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent;
      overscroll-behavior: none;
    }
    input, textarea { -webkit-user-select: text; user-select: text; }
  `
  document.head.appendChild(style)
}

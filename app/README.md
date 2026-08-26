# Featherlite Signature - Android app

A Capacitor shell around the website in `../web`. The app does **not** contain a
second implementation of the UI: the build compiles the same React sources, so
layout, typography, animations and imagery are the ones the site ships. What the
app adds is offline packaging and native behaviour.

- **Package:** `com.futeservices.featherlitesignature`
- **Target:** Android tablets, landscape, full-screen (no status or nav bar)
- **Size:** ~590 MB - the whole walkthrough is inside the APK
- **Network:** not required, apart from the two embeds listed below

## Build

```bash
npm install
npm run offline:fetch                     # mirror CDN assets, fonts, pdf.js worker
node scripts/mirror-location-tour.mjs     # mirror the Pano2VR tour behind /location
npm run apk                               # signed release -> dist/
npm run apk:debug                         # debug build, for a quick install
```

Requirements: Node 20+, Android SDK (platform 35, build-tools 35), and **JDK 21**
- Capacitor 7 compiles against Java 21, and a leftover JDK 17 in `JAVA_HOME`
fails with `invalid source release: 21`. `scripts/build-apk.mjs` checks the
version of every candidate JDK and picks a usable one, so usually there is
nothing to configure.

Install on a device:

```bash
adb install -r dist/FeatherliteSignature-v1.0.0-release.apk
```

The APK is over the Play Store's 200 MB limit by design (offline was the
requirement), so it is distributed by sideloading. The device needs roughly
1.2 GB free to install.

## Building on GitHub Actions

`.github/workflows/android.yml` builds the same APK on CI. It is deliberately
not run on every push - the artifact is ~550 MB - so trigger it one of two ways:

- **Actions -> Android APK -> Run workflow** (pick `release` or `debug`)
- **push a `v*` tag**, which also attaches the APK to the GitHub release

The APK lands as a workflow artifact, kept for 30 days.

### Signing on CI

Without secrets the workflow falls back to a **debug** build, because an
unsigned release APK cannot be installed. To get signed release builds, add
these repository secrets (Settings -> Secrets and variables -> Actions):

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 app/keystore/featherlite-release.jks` |
| `ANDROID_KEYSTORE_PASSWORD` | `storePassword` from `app/keystore/keystore.properties` |
| `ANDROID_KEY_ALIAS` | `featherlite` (optional, this is the default) |
| `ANDROID_KEY_PASSWORD` | same as the store password (optional) |

On Windows PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("app/keystore/featherlite-release.jks")) | Set-Clipboard
```

Use the **same** keystore CI uses locally, or tablets will refuse the update.

The mirrored assets are cached between runs, keyed on the web sources - a run
that changes no remote URL skips the ~250 MB download. Tick **refresh_assets**
to force a fresh mirror.

## How "offline" is achieved

The website pulls images from Cloudflare Images and Cloudinary, fonts from
Google Fonts, pdf.js from unpkg, Pannellum from jsDelivr, and the Location tour
from futeservices.com. None of that is reachable on a device with no network.

1. `scripts/fetch-offline-assets.mjs` scans `../web/src` for every remote URL -
   plain literals as well as ones assembled from a base constant - downloads
   each one into `offline/`, and writes `offline/manifest.json`.
2. `scripts/mirror-location-tour.mjs` mirrors the Pano2VR tour: player, skin,
   config and all 300 cube-face tiles.
3. `scripts/offline-plugin.mjs` is a Vite plugin that rewrites those URLs to
   their local copies **during the app build only**. `../web` is never edited,
   so the website keeps using its CDNs.
4. The same plugin then re-scans the finished bundle and **fails the build** if
   any mirrored host survived. A missing asset cannot ship silently.
5. It also drops packaged files nothing references. `web/public` carries three
   generations of the same panoramas (`public/vr` is not referenced at all),
   which would have added ~500 MB of images the app never opens.

## Still needs a network

| Feature | Why |
| --- | --- |
| Media -> "Watch full film" | A YouTube embed (`Media.tsx`). To make it offline, put the film in `web/public/media/` and play it from there instead of the iframe. |
| Gallery API | Already unused - `GalleryPage` reads the bundled `Data/Gallery.json`, whose images are mirrored. Nothing to do. |

Everything else - home, floor plans, unit plans, the 3D model, the VR tour, the
Location tour, amenities, gallery, brochure, certifications and technical
specifications - works with the device in airplane mode. That was verified on a
Pixel Tablet emulator (2560x1600) with Wi-Fi and mobile data off.

## Native behaviour

`src/app-runtime.ts` is injected into the bundle for the app build only:

- the hardware back button follows the router, and backgrounds the app at home
- long-press callouts, text selection and pinch zoom are disabled
- `URL.parse` / `URL.canParse` are polyfilled. Android System WebView is never
  updated on an offline tablet, and pdf.js (the brochure) needs them from
  Chrome 126 onward - without the shim the brochure opens to a black screen.

`android/.../MainActivity.java` locks landscape, hides the system bars, keeps the
screen awake during a walkthrough, and turns off asset compression for media
(`noCompress` in `app/build.gradle`) so 570 MB of already-compressed images do
not get re-compressed into the APK.

## Signing

`npm run apk` signs with `keystore/featherlite-release.jks`, configured in
`keystore/keystore.properties`. **Both files are gitignored and exist only on
the machine that built the app - back them up.** Android refuses to update an
installed app that is signed with a different key, so losing the keystore means
every tablet has to uninstall and reinstall.

## Icons

`scripts/make-icons.mjs` builds the launcher icon and splash from the brand
wordmark, then `npx capacitor-assets generate --android` fans them out. The
wordmark only exists at 200x100, so the icon is upscaled and looks soft. Drop a
1024x1024 logo at `resources/logo-source.png` and re-run both commands for a
crisp icon.

## After a change to the website

```bash
npm run offline:fetch   # only if new remote URLs were added
npm run apk
```

Bump `version` in `package.json` and `versionCode`/`versionName` in
`android/app/build.gradle` for each release you hand out.

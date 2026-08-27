# Featherlite Signature

Two deliverables from one codebase:

| Folder | What it is |
| --- | --- |
| [`web/`](web) | The website - React 19 + Vite + Tailwind. This is the single source of truth for every screen, style and animation. |
| [`app/`](app) | The Android app. A Capacitor shell that packages the **same** web build, with every remote asset mirrored so it runs with no network at all. |

`app/` never contains a copy of the UI. It builds `web/` and rewires the asset
URLs at build time, which is why the app is pixel-identical to the site and why
a change to the site reaches the app by rebuilding, not by porting.

## Working on the website

```bash
cd web
npm install
npm run dev        # http://localhost:5173
npm run build      # -> web/dist
```

**Deploying:** the project now lives in `web/`, so a host pointed at the repo
root needs its build directory updated - on Vercel that is
Settings -> General -> Root Directory -> `web`.

## Building the Android app

```bash
cd app
npm install
npm run offline:fetch                     # mirror remote assets (once)
node scripts/mirror-location-tour.mjs     # mirror the Location VR tour (once)
npm run apk                               # -> app/dist/FeatherliteSignature-v1.0.0-release.apk
```

Full details, including the two features that still need a network, are in
[`app/README.md`](app/README.md).

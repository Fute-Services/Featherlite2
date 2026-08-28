# App-only media

Files here are copied into the packaged app (`www/media/`) at build time by
`scripts/app-ui-plugin.mjs`. They are **not** part of the website - `web/` is
never read from or written to for this, so nothing here reaches the live site.

## walkthrough.mp4

Drop the walk-through film here as `walkthrough.mp4` and the app plays it with
no network. Nothing else needs switching on: `src/ui/WalkthroughModal.tsx`
probes for it at runtime and falls back to the YouTube embed when it is absent.

Encode it so playback can start before the whole file has arrived:

```bash
ffmpeg -i source.mov -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k \
       -movflags +faststart walkthrough.mp4
```

Commit the file. The GitHub Actions build checks out the repository, so a film
that only exists on someone's laptop will be missing from the release APK.

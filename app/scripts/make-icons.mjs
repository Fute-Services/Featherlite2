/**
 * Builds the launcher icon and splash source images from the brand wordmark,
 * on the same black the app itself opens on. @capacitor/assets then fans these
 * out into every Android density.
 *
 * The wordmark ships at 200x100 - the only size that exists - so the icon is
 * upscaled. Drop a higher-resolution logo at resources/logo-source.png and
 * re-run to get a crisper result.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const APP = path.resolve(HERE, '..')
const WEB = path.resolve(APP, '..', 'web')
const RES = path.join(APP, 'resources')

const BACKGROUND = { r: 0, g: 0, b: 0, alpha: 1 }

async function pickLogo() {
  const override = path.join(RES, 'logo-source.png')
  if (await fs.stat(override).then(() => true, () => false)) return override
  return path.join(WEB, 'src', 'assets', 'Logo.png')
}

async function compose({ size, logoWidthRatio, out }) {
  const logoPath = await pickLogo()
  const logoWidth = Math.round(size * logoWidthRatio)
  const logo = await sharp(logoPath)
    .resize({ width: logoWidth, kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer()
  const { height: logoHeight } = await sharp(logo).metadata()

  await sharp({
    create: { width: size, height: size, channels: 4, background: BACKGROUND },
  })
    .composite([
      {
        input: logo,
        left: Math.round((size - logoWidth) / 2),
        top: Math.round((size - logoHeight) / 2),
      },
    ])
    .png()
    .toFile(out)

  console.log(`  ${path.relative(APP, out)}  ${size}x${size}`)
}

await fs.mkdir(RES, { recursive: true })
// the launcher crops icons to a circle/squircle, so the mark stays well inside
await compose({ size: 1024, logoWidthRatio: 0.58, out: path.join(RES, 'icon.png') })
await compose({ size: 1024, logoWidthRatio: 0.5, out: path.join(RES, 'icon-foreground.png') })
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: BACKGROUND } })
  .png()
  .toFile(path.join(RES, 'icon-background.png'))
await compose({ size: 2732, logoWidthRatio: 0.26, out: path.join(RES, 'splash.png') })
await fs.copyFile(path.join(RES, 'splash.png'), path.join(RES, 'splash-dark.png'))

console.log('icon + splash sources written to app/resources/')

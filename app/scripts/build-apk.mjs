/**
 * Runs the Gradle build and drops a named APK in app/dist/.
 *
 *   node scripts/build-apk.mjs debug     unsigned-ish, installable for testing
 *   node scripts/build-apk.mjs release   signed with keystore/featherlite-release.jks
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const APP = path.resolve(HERE, '..')
const ANDROID = path.join(APP, 'android')

const variant = (process.argv[2] || 'release').toLowerCase()
if (!['debug', 'release'].includes(variant)) {
  console.error(`unknown variant "${variant}" - use debug or release`)
  process.exit(1)
}

const MIN_JDK = 21

/**
 * Capacitor 7 compiles against Java 21, so an older JAVA_HOME - JDK 17 is a
 * common leftover - fails with "invalid source release: 21". Candidates are
 * checked for their actual version rather than just for a java binary.
 */
async function resolveJavaHome() {
  const candidates = [
    process.env.JAVA_HOME,
    path.join(process.env.LOCALAPPDATA || '', 'Android', 'jdk21'),
    path.join(process.env.LOCALAPPDATA || '', 'Android', 'Android Studio', 'jbr'),
    'C:/Program Files/Android/Android Studio/jbr',
    'C:/Program Files/Eclipse Adoptium/jdk-21',
  ]
  const rejected = []
  for (const dir of candidates) {
    if (!dir) continue
    const version = await javaMajor(dir)
    if (version === null) continue
    if (version >= MIN_JDK) return dir
    rejected.push(`${dir} (Java ${version})`)
  }
  throw new Error(
    `No JDK ${MIN_JDK}+ found${rejected.length ? ` - too old: ${rejected.join(', ')}` : ''}. ` +
      'Install Temurin 21 and point JAVA_HOME at it.',
  )
}

/** Returns the JDK's feature version, or null when dir holds no usable JDK. */
async function javaMajor(dir) {
  const exe = path.join(dir, 'bin', process.platform === 'win32' ? 'java.exe' : 'java')
  if (!(await fs.stat(exe).then(() => true, () => false))) return null
  const output = await new Promise((resolve) => {
    const child = spawn(exe, ['-version'], { stdio: ['ignore', 'pipe', 'pipe'] })
    let text = ''
    child.stdout.on('data', (d) => (text += d))
    child.stderr.on('data', (d) => (text += d))
    child.on('error', () => resolve(''))
    child.on('close', () => resolve(text))
  })
  const m = output.match(/version "(\d+)(?:\.(\d+))?/)
  if (!m) return null
  // 1.8.0_x style versions report the feature version in the second group
  return m[1] === '1' ? Number(m[2]) : Number(m[1])
}

const javaHome = await resolveJavaHome()
console.log(`JAVA_HOME = ${javaHome}`)

// an absolute path, because with shell:true a bare name is looked up on PATH
const gradlew = path.join(ANDROID, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew')
const task = variant === 'debug' ? 'assembleDebug' : 'assembleRelease'

await new Promise((resolve, reject) => {
  const child = spawn(gradlew, [task], {
    cwd: ANDROID,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, JAVA_HOME: javaHome },
  })
  child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`gradle exited ${code}`))))
})

const built = path.join(ANDROID, 'app', 'build', 'outputs', 'apk', variant)
const apk = (await fs.readdir(built)).find((f) => f.endsWith('.apk'))
if (!apk) throw new Error(`no APK produced in ${built}`)

const { version } = JSON.parse(await fs.readFile(path.join(APP, 'package.json'), 'utf8'))
const outDir = path.join(APP, 'dist')
await fs.mkdir(outDir, { recursive: true })
const dest = path.join(outDir, `FeatherliteSignature-v${version}-${variant}.apk`)
await fs.copyFile(path.join(built, apk), dest)

const { size } = await fs.stat(dest)
console.log(`\nAPK: ${dest}  (${(size / 1024 / 1024).toFixed(0)} MB)`)

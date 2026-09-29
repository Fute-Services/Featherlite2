import { useState } from 'react'
import { ThemeProvider } from './Context/ThemeContext'
import { IntroProvider } from './Context/IntroContext'
import Router from './Routs/Router'

// ponytail: client-side gate only (password ships in the JS bundle, so it's
// not real security) - Vercel's own Password Protection needs a Pro plan,
// which this team doesn't have. Upgrade to that (or server-side auth) if
// this ever needs to actually keep people out.
const SITE_PASSWORD = 'FUTESERVICES@2'
const UNLOCK_KEY = 'site-unlocked'

const PasswordGate = ({ children }: { children: React.ReactNode }) => {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCK_KEY) === '1')
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return children

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === SITE_PASSWORD) {
      sessionStorage.setItem(UNLOCK_KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#111' }}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 32, background: '#fff', borderRadius: 8, width: 320 }}>
        <label htmlFor="site-password" style={{ fontWeight: 600 }}>Enter password</label>
        <input
          id="site-password"
          type="password"
          autoFocus
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false) }}
          style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
        {error && <span style={{ color: 'crimson', fontSize: 13 }}>Wrong password</span>}
        <button type="submit" style={{ padding: 10, background: '#111', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Enter
        </button>
      </form>
    </div>
  )
}

const App = () => {
  return (
    <PasswordGate>
      <ThemeProvider>
        <IntroProvider>
          <Router />
        </IntroProvider>
      </ThemeProvider>
    </PasswordGate>
  )
}

export default App

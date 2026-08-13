import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import logo from '../../assets/Logo.png'
import ThemeToggle from '../ThemeToggle/ThemeToggle'

const Header = () => {
  const { pathname } = useLocation()
  // the light/dark switch only drives the home hero, so it is shown there alone
  const showThemeToggle = pathname === '/'
  // these pages dropped the bottom Navbar entirely, so give them an explicit way back
  const showBackButton = pathname === '/masterplan' || pathname === '/floor-plan'

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[1000] flex items-start justify-between px-5 py-5 sm:px-10 sm:py-7">
      <Link to="/" className="pointer-events-auto">
        <img
          src={logo}
          alt="Featherlite Signature"
          className="h-10 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:h-20"
        />
      </Link>
      {showThemeToggle && (
        <div className="pointer-events-auto py-10 px-10">
          <ThemeToggle />
        </div>
      )}
      {showBackButton && (
        <Link
          to="/"
          aria-label="Back to home"
          className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-black/45 px-3.5 py-2 text-xs font-medium text-white/85 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-colors hover:bg-black/60 hover:text-white sm:text-sm"
        >
          <ArrowLeft className="size-4" strokeWidth={2} />
          Home
        </Link>
      )}
    </header>
  )
}

export default Header

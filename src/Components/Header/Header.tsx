import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
const logo = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/logo/public";
import ThemeToggle from '../ThemeToggle/ThemeToggle'

const Header = () => {
  const { pathname } = useLocation()
  // the light/dark switch only drives the home hero, so it is shown there alone
  const showThemeToggle = pathname === '/'
  // these pages dropped the bottom Navbar entirely, so give them an explicit way back
  const showBackButton = false
  const logoOnRight = pathname === '/media'

  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-0 z-[1010] flex items-start px-5 py-5 sm:px-10 sm:py-7 ${
        logoOnRight ? 'flex-row-reverse justify-between' : 'justify-between'
      }`}
    >
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
          className="group pointer-events-auto relative z-[1010] flex items-center gap-1.5 overflow-hidden rounded-full border border-white/[0.1] bg-black/45 px-3.5 py-2 text-xs font-medium text-white/85 shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.15),inset_-1px_-1px_1px_rgba(0,0,0,0.2),0_10px_30px_-8px_rgba(0,0,0,0.8)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 hover:bg-black/60 hover:text-white sm:text-sm"
        >
          {/* Glass sheen highlight along the top edge */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-2 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
          />
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" strokeWidth={2} />
          Home
        </Link>
      )}
    </header>
  )
}

export default Header

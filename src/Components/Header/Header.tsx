import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/Logo.png'
import ThemeToggle from '../ThemeToggle/ThemeToggle'

const Header = () => {
  const { pathname } = useLocation()
  // the light/dark switch only drives the home hero, so it is shown there alone
  const showThemeToggle = pathname === '/'

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-5 py-5 sm:px-10 sm:py-7">
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
    </header>
  )
}

export default Header

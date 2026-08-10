import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../Context/ThemeContext'
import type { Theme } from '../../Context/ThemeContext'

const options: { value: Theme; Icon: typeof Sun; label: string }[] = [
  { value: 'light', Icon: Sun, label: 'Light mode' },
  { value: 'dark', Icon: Moon, label: 'Dark mode' },
]

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/45 p-1 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {options.map(({ value, Icon, label }) => {
        const isActive = theme === value
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => setTheme(value)}
            className={[
              'flex size-8 cursor-pointer items-center justify-center rounded-full transition-all duration-300',
              isActive
                ? 'bg-gradient-to-b from-[#e23a26] to-[#a3230f] text-white shadow-[0_4px_14px_-4px_rgba(226,58,38,0.9)]'
                : 'text-white/60 hover:text-white',
            ].join(' ')}
          >
            <Icon size={16} strokeWidth={1.8} />
          </button>
        )
      })}
    </div>
  )
}

export default ThemeToggle

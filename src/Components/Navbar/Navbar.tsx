import { NavLink } from 'react-router-dom'
import { Home, MapPin } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import floorPlanIcon from '../../assets/icons/floor_plan_icon.png'
import vrIcon from '../../assets/icons/Vr_icon.png'
import amenitiesIcon from '../../assets/icons/Amenities_icon.png'
import galleryIcon from '../../assets/icons/Gallery icon.png'

/**
 * The supplied PNGs are baked in different colours (Home is black, the rest white),
 * so they are painted as masks instead of images — the glyph then always takes the
 * pill's own text colour and the active/inactive states stay consistent.
 */
const MaskIcon = ({ src }: { src: string }) => (
    <span
        aria-hidden
        className="inline-block size-[16px] bg-current"
        style={{
            maskImage: `url("${src}")`,
            WebkitMaskImage: `url("${src}")`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
        }}
    />
)

export type NavItem = {
    label: string
    path: string
    /** either an imported PNG url (masked) or a lucide component */
    icon: string | React.ComponentType<LucideProps>
}

export const navItems: NavItem[] = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Location', path: '/location', icon: MapPin },
    { label: 'Floor Plan', path: '/floor-plan', icon: floorPlanIcon },
    { label: 'VR Tour', path: '/vr-tour', icon: vrIcon },
    { label: 'Amenities', path: '/amenities', icon: amenitiesIcon },
    { label: 'Media', path: '/media', icon: galleryIcon },
]

const Navbar = () => {
    return (
        <nav className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 sm:bottom-8">
            {/* Main Container - Compact size & clean dark glass */}
            <div className="no-scrollbar pointer-events-auto flex max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-white/[0.04] bg-black/45 p-1.5 shadow-[inset_1px_1px_0_rgba(255,255,255,0.14),inset_-1px_-1px_0_rgba(255,255,255,0.14),0_15px_35px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:gap-2 sm:p-2">
                {navItems.map(({ label, path, icon: Icon }) => (
                    <NavLink key={path} to={path} end={path === '/'} className="shrink-0">
                        {({ isActive }) => (
                            <span
                                className={[
                                    // dark pill; the "glass" reads from a diagonal rim light that catches
                                    // only the top-left and bottom-right of the edge
                                    'group flex items-center gap-2 rounded-full border transition-all duration-300',
                                    'px-3 py-1.5 sm:px-4 sm:py-2',
                                    isActive
                                        ? 'border-white/[0.06] bg-gradient-to-b from-[#4a1410] to-[#1c0605] text-white shadow-[inset_1px_1px_0_rgba(255,255,255,0.30),inset_-1px_-1px_0_rgba(255,255,255,0.30),0_2px_10px_rgba(0,0,0,0.5)]'
                                        : 'border-white/[0.06] bg-gradient-to-b from-[#1c1c1f] to-[#0d0d0f] text-white/95 shadow-[inset_1px_1px_0_rgba(255,255,255,0.26),inset_-1px_-1px_0_rgba(255,255,255,0.26),0_2px_10px_rgba(0,0,0,0.5)] hover:from-[#3d120e] hover:to-[#190605] hover:text-white hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),inset_-1px_-1px_0_rgba(255,255,255,0.35),0_2px_12px_rgba(232,50,28,0.25)]',
                                ].join(' ')}
                            >
                                {/* Icon wrapper circle */}
                                <span
                                    className={[
                                        'flex size-7 items-center justify-center rounded-full transition-all duration-300',
                                        isActive
                                            ? 'bg-[#e8321c] text-white shadow-[0_0_12px_rgba(232,50,28,0.55),inset_1px_1px_0_rgba(255,255,255,0.35),inset_-1px_-1px_0_rgba(255,255,255,0.35)]'
                                            : 'bg-[#08080a] text-white shadow-[inset_1px_1px_0_rgba(255,255,255,0.20),inset_-1px_-1px_0_rgba(255,255,255,0.20)] group-hover:bg-[#e8321c] group-hover:text-white group-hover:shadow-[0_0_12px_rgba(232,50,28,0.55),inset_1px_1px_0_rgba(255,255,255,0.35),inset_-1px_-1px_0_rgba(255,255,255,0.35)]',
                                    ].join(' ')}
                                >
                                    {typeof Icon === 'string' ? (
                                        <MaskIcon src={Icon} />
                                    ) : (
                                        <Icon size={14} strokeWidth={2} />
                                    )}
                                </span>
                                <span className="pr-1 text-xs font-medium whitespace-nowrap text-white sm:text-sm">
                                    {label}
                                </span>
                            </span>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}

export default Navbar
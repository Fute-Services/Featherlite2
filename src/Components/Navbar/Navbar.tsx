import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, MapPin } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import floorPlanIcon from '../../assets/icons/floor_plan_icon.png'
import vrIcon from '../../assets/icons/Vr_icon.png'
import amenitiesIcon from '../../assets/icons/Amenities_icon.png'
import galleryIcon from '../../assets/icons/Gallery icon.png'
import { useIntro } from '../../Context/IntroContext'

/**
 * The supplied PNGs are baked in different colours (Home is black, the rest white),
 * so they are painted as masks instead of images — the glyph then always takes the
 * pill's own text colour and the active/inactive states stay consistent.
 */
const MaskIcon = ({ src }: { src: string }) => (
    <span
        aria-hidden
        className="inline-block size-[13px] bg-current"
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

type NavItem = {
    label: string
    path: string
    /** either an imported PNG url (masked) or a lucide component */
    icon: string | React.ComponentType<LucideProps>
}

const navItems: NavItem[] = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Location', path: '/location', icon: MapPin },
    { label: 'Floor Plan', path: '/masterplan', icon: floorPlanIcon },
    { label: 'VR Tour', path: '/vr-tour', icon: vrIcon },
    { label: 'Amenities', path: '/amenities', icon: amenitiesIcon },
    { label: 'Media', path: '/media', icon: galleryIcon },
]

const navVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: { y: 0, opacity: 1 },
}

const Navbar = () => {
    const { introDone } = useIntro()

    return (
        <nav className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 sm:bottom-8">
            {/* Main Container - Black Liquid Glass (frosted, dark translucent pill) */}
            <motion.div
                initial="hidden"
                animate={introDone ? 'visible' : 'hidden'}
                variants={navVariants}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="no-scrollbar pointer-events-auto relative flex max-w-full items-center gap-2 overflow-x-auto rounded-full border border-white/[0.1] bg-black/45 px-2.5 py-1 shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.15),inset_-1px_-1px_1px_rgba(0,0,0,0.2),0_20px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl backdrop-saturate-150 sm:gap-2.5 sm:px-3.5 sm:py-2">
                {/* Glass sheen highlight along the top edge */}
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-3 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
                />
                {navItems.map(({ label, path, icon: Icon }) => (
                    <NavLink key={path} to={path} end={path === '/'} className="shrink-0">
                        {({ isActive }) => (
                            <span
                                className={[
                                    'group relative flex items-center gap-1.5 overflow-hidden rounded-full backdrop-blur-md transition-all duration-300 ease-out',
                                    'px-2.5 py-1 sm:px-3 sm:py-1.5',
                                    'hover:scale-[1.04] active:scale-[0.97]',
                                    isActive
                                        ? 'bg-[rgba(231,33,0,0.28)] text-white shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.45),inset_-1px_-1px_1px_rgba(0,0,0,0.25),0_4px_18px_rgba(231,33,0,0.35)]'
                                        : 'bg-white/[0.08] text-white/85 shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.35),inset_-1px_-1px_1px_rgba(0,0,0,0.2)] hover:bg-[rgba(231,33,0,0.24)] hover:text-white hover:shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.45),inset_-1px_-1px_1px_rgba(0,0,0,0.25),0_4px_18px_rgba(231,33,0,0.3)]',
                                ].join(' ')}
                            >
                                {/* Liquid glass sheen - soft highlight blob drifting across the top-left */}
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute -left-2 -top-3 h-8 w-12 rounded-full bg-white/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
                                />
                                {/* Icon wrapper circle */}
                                <span
                                    className={[
                                        'flex size-6 items-center justify-center rounded-full transition-all duration-300 sm:size-[26px]',
                                        isActive
                                            ? 'bg-[#e8321c] text-white shadow-[0_0_12px_rgba(232,50,28,0.6),inset_1px_1px_0_rgba(255,255,255,0.35),inset_-1px_-1px_0_rgba(255,255,255,0.2)]'
                                            : 'bg-white/15 text-white/90 shadow-[inset_1px_1px_0_rgba(255,255,255,0.30),inset_-1px_-1px_0_rgba(255,255,255,0.10)] group-hover:bg-[#e8321c] group-hover:text-white group-hover:shadow-[0_0_12px_rgba(232,50,28,0.6),inset_1px_1px_0_rgba(255,255,255,0.35),inset_-1px_-1px_0_rgba(255,255,255,0.2)]',
                                    ].join(' ')}
                                >
                                    {typeof Icon === 'string' ? (
                                        <MaskIcon src={Icon} />
                                    ) : (
                                        <Icon size={13} strokeWidth={2} />
                                    )}
                                </span>
                                <span className="pr-1 text-xs font-medium whitespace-nowrap text-white/95 group-hover:text-white">
                                    {label}
                                </span>
                            </span>
                        )}
                    </NavLink>
                ))}
            </motion.div>
        </nav>
    )
}

export default Navbar
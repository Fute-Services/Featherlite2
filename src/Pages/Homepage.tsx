import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../Context/ThemeContext'
import { useIntro } from '../Context/IntroContext'
import heroLight from '../assets/Home/Home page Light.png'
import heroDark from '../assets/Home/Home page dark.png'

const stats = ['10 floors', '2 Acre Area', '43% Ground Area', '25% Green Cover']
const headingLines = [
    ['Designed', 'For'],
    ['Better', 'Tomorrow'],
]

const headingContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.4, delayChildren: 0.2 } },
}

const lineVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
}

const statsContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.25, delayChildren: 1.3 } },
}

const statItemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
}

const Homepage = () => {
    const { theme } = useTheme()
    const { introDone } = useIntro()

    // fires a warm "sunset glow" sweep across the hero every time the theme
    // is toggled, so day <-> night reads as a dusk transition rather than a
    // flat crossfade
    const [glowKey, setGlowKey] = useState(0)
    const isFirstRender = useRef(true)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        setGlowKey((key) => key + 1)
    }, [theme])

    return (
        <section className="relative h-dvh w-full overflow-hidden">
            {/* both renders stay mounted so the theme switch cross-fades instead of flashing */}
            {[
                { src: heroLight, active: theme === 'light' },
                { src: heroDark, active: theme === 'dark' },
            ].map(({ src, active }) => (
                <img
                    key={src}
                    src={src}
                    alt="Featherlite Signature building"
                    // @ts-expect-error fetchpriority isn't in React's img typings yet
                    fetchpriority={active ? 'high' : undefined}
                    loading={active ? 'eager' : 'lazy'}
                    className={[
                        'absolute inset-0 size-full object-cover transition-opacity duration-[2200ms] ease-in-out',
                        active ? 'opacity-100' : 'opacity-0',
                    ].join(' ')}
                />
            ))}

            {/* warm sunset glow that flares in and burns off across the day/night crossfade */}
            <AnimatePresence>
                {glowKey > 0 && (
                    <motion.div
                        key={glowKey}
                        aria-hidden
                        className="pointer-events-none absolute inset-0 z-[5] mix-blend-soft-light"
                        style={{
                            background:
                                'radial-gradient(120% 90% at 80% 65%, rgba(255,150,60,0.9) 0%, rgba(255,90,40,0.55) 30%, rgba(120,30,60,0.25) 55%, transparent 75%)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2.6, times: [0, 0.35, 1], ease: 'easeInOut' }}
                    />
                )}
            </AnimatePresence>

            {/* readability wash behind the copy */}
            <div className="absolute inset-0 bg-gradient-to-r " />
            <div className="absolute inset-x-0 bottom-0 h-1/3  " />

            <div className="relative z-10 flex h-full items-center px-6 sm:px-10 lg:pl-[50px] lg:pr-10">
                <div className="max-w-2xl">
                    <motion.h1
                        initial="hidden"
                        animate={introDone ? 'visible' : 'hidden'}
                        variants={headingContainerVariants}
                        className="font-display text-4xl leading-[1.1] font-normal text-white sm:text-6xl lg:text-6xl"
                    >
                        {headingLines.map((line, lineIndex) => (
                            <span key={lineIndex} className="block overflow-hidden py-1">
                                <motion.span
                                    variants={lineVariants}
                                    transition={{ duration: 2, ease: 'easeInOut' }}
                                    className="block"
                                >
                                    {line.join(' ')}
                                </motion.span>
                            </span>
                        ))}
                    </motion.h1>

                    <motion.div
                        initial="hidden"
                        animate={introDone ? 'visible' : 'hidden'}
                        variants={statsContainerVariants}
                        className="mt-2 ml-[5px] -translate-y-[15px] flex flex-wrap items-center gap-x-2 gap-y-2 font-['IBM_Plex_Sans'] text-xs text-white/85 sm:mt-3 sm:gap-x-6 sm:text-sm"
                    >
                        {stats.map((stat, index) => (
                            <motion.span
                                key={stat}
                                variants={statItemVariants}
                                transition={{ duration: 0.9, ease: 'easeOut' }}
                                className="flex items-center gap-4 sm:gap-2"
                            >
                                {index > 0 && <span className="h-4 w-px bg-white" />}
                                {stat}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Homepage
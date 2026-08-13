import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../../assets/Logo.png'
import { useIntro } from '../../Context/IntroContext'

const LOGO_FADE_IN_DELAY = 200
const LOGO_FADE_DURATION = 0.6
const LOGO_HOLD = 900
const CURTAIN_OPEN_DURATION = 0.8

/**
 * Entrance sequence: the screen starts fully covered by a black curtain
 * (the homepage is never visible underneath), the logo fades in, holds
 * briefly, then fades out while the curtain panels slide apart to reveal
 * the homepage. Plays on every full page load/refresh.
 */
const IntroCurtain = () => {
    const [visible, setVisible] = useState(true)
    const [showLogo, setShowLogo] = useState(false)
    const [opening, setOpening] = useState(false)
    const { markIntroDone } = useIntro()

    useEffect(() => {
        const toLogo = setTimeout(() => setShowLogo(true), LOGO_FADE_IN_DELAY)
        const toOpen = setTimeout(
            () => {
                setShowLogo(false)
                setOpening(true)
            },
            LOGO_FADE_IN_DELAY + LOGO_FADE_DURATION * 1000 + LOGO_HOLD,
        )
        const toDone = setTimeout(
            () => {
                setVisible(false)
                // page content (heading/stats/navbar) only starts animating in
                // once the curtain has fully finished opening
                markIntroDone()
            },
            LOGO_FADE_IN_DELAY + LOGO_FADE_DURATION * 1000 + LOGO_HOLD + CURTAIN_OPEN_DURATION * 1000,
        )

        return () => {
            clearTimeout(toLogo)
            clearTimeout(toOpen)
            clearTimeout(toDone)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AnimatePresence>
            {visible && (
                <div className="pointer-events-none fixed inset-0 z-[2000] overflow-hidden">
                    {/* Top curtain panel - starts fully closed, opens upward at the end */}
                    <motion.div
                        className="absolute inset-x-0 top-0 h-1/2 bg-[#050505]"
                        initial={{ y: 0 }}
                        animate={{ y: opening ? '-100%' : 0 }}
                        transition={{ duration: CURTAIN_OPEN_DURATION, ease: [0.76, 0, 0.24, 1] }}
                    />
                    {/* Bottom curtain panel - starts fully closed, opens downward at the end */}
                    <motion.div
                        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#050505]"
                        initial={{ y: 0 }}
                        animate={{ y: opening ? '100%' : 0 }}
                        transition={{ duration: CURTAIN_OPEN_DURATION, ease: [0.76, 0, 0.24, 1] }}
                    />

                    {/* Logo */}
                    <AnimatePresence>
                        {showLogo && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: LOGO_FADE_DURATION, ease: 'easeOut' }}
                            >
                                <img
                                    src={logo}
                                    alt="Featherlite Signature"
                                    className="h-24 w-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] sm:h-36"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </AnimatePresence>
    )
}

export default IntroCurtain

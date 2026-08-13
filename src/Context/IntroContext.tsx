import { createContext, useContext, useState, type ReactNode } from 'react'

type IntroContextValue = {
    /** true once the curtain intro has finished (or was skipped because it already played this session) */
    introDone: boolean
    markIntroDone: () => void
}

const IntroContext = createContext<IntroContextValue | null>(null)

export const IntroProvider = ({ children }: { children: ReactNode }) => {
    const [introDone, setIntroDone] = useState(false)

    return (
        <IntroContext.Provider value={{ introDone, markIntroDone: () => setIntroDone(true) }}>
            {children}
        </IntroContext.Provider>
    )
}

export const useIntro = () => {
    const ctx = useContext(IntroContext)
    if (!ctx) throw new Error('useIntro must be used within an IntroProvider')
    return ctx
}

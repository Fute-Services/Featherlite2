import { useTheme } from '../Context/ThemeContext'
import heroLight from '../assets/Home/Home page Light.png'
import heroDark from '../assets/Home/Home page dark.png'

const stats = ['10 floors', '2 Acre Area', '43% Ground Area', '25% Green Cover']

const Homepage = () => {
    const { theme } = useTheme()

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
                    className={[
                        'absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out',
                        active ? 'opacity-100' : 'opacity-0',
                    ].join(' ')}
                />
            ))}

            {/* readability wash behind the copy */}
            <div className="absolute inset-0 bg-gradient-to-r " />
            <div className="absolute inset-x-0 bottom-0 h-1/3  " />

            <div className="relative z-10 flex h-full items-center px-6 sm:px-10 lg:pl-[50px] lg:pr-10">
                <div className="max-w-2xl">
                    <h1 className="font-display text-4xl leading-[1.1] font-normal text-white sm:text-6xl lg:text-6xl">
                        Designed For
                        <br />
                        Better Tomorrow
                    </h1>

                    <div className="mt-6 ml-[5px] -translate-y-[15px] flex flex-wrap items-center gap-x-2 gap-y-2 font-['IBM_Plex_Sans'] text-xs text-white/85 sm:mt-8 sm:gap-x-6 sm:text-sm">
                        {stats.map((stat, index) => (
                            <span key={stat} className="flex items-center gap-4 sm:gap-2">
                                {index > 0 && <span className="h-4 w-px bg-white" />}
                                {stat}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Homepage

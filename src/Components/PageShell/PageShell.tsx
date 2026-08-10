import type { ReactNode } from 'react'

type PageShellProps = {
  title: string
  subtitle?: string
  children?: ReactNode
}

/** Neutral scaffold the not-yet-built sections sit on, so routing is visible today. */
const PageShell = ({ title, subtitle, children }: PageShellProps) => {
  return (
    <section className="flex min-h-dvh w-full flex-col items-center justify-center px-6 pt-28 pb-32 text-center">
      <h1 className="font-display text-4xl font-medium text-neutral-900 sm:text-5xl">{title}</h1>
      {subtitle && (
        <p className="mt-4 max-w-xl text-sm text-neutral-600 sm:text-base">{subtitle}</p>
      )}
      {children}
    </section>
  )
}

export default PageShell

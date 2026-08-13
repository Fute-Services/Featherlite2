import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell/PageShell'

const NotFound = () => (
  <PageShell title="404" subtitle="This page does not exist.">
    <Link
      to="/"
      className="mt-8 rounded-full bg-gradient-to-b from-[#e23a26] to-[#a3230f] px-6 py-2.5 text-sm font-medium text-white transition-transform duration-300 hover:scale-105"
    >
      Back to Home
    </Link>
  </PageShell>
)

export default NotFound

import { ThemeProvider } from './Context/ThemeContext'
import { IntroProvider } from './Context/IntroContext'
import Router from './Routs/Router'
import OfflineDownload from './Components/OfflineDownload'

const App = () => {
  return (
    <ThemeProvider>
      <IntroProvider>
        <Router />
        <OfflineDownload />
      </IntroProvider>
    </ThemeProvider>
  )
}

export default App

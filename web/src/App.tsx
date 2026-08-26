import { ThemeProvider } from './Context/ThemeContext'
import { IntroProvider } from './Context/IntroContext'
import Router from './Routs/Router'

const App = () => {
  return (
    <ThemeProvider>
      <IntroProvider>
        <Router />
      </IntroProvider>
    </ThemeProvider>
  )
}

export default App

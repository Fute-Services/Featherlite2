import { ThemeProvider } from './Context/ThemeContext'
import Router from './Routs/Router'

const App = () => {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  )
}

export default App

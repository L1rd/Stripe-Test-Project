import { BrowserRouter } from "react-router-dom"
import { FlowBootstrap } from "./features/onboarding/components/FlowBootstrap"
import { AppRouter } from "./app/router/AppRouter"
import { GlobalStyles } from "./app/styles/GlobalStyles"
import { theme } from "./app/styles/theme"
import { ThemeProvider } from "styled-components"


function App() {

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <FlowBootstrap>
          <AppRouter />
        </FlowBootstrap>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

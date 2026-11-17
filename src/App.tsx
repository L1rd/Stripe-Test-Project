import { BrowserRouter } from "react-router-dom"
import { GlobalStyles } from "./app/styles/GlobalStyles"
import { theme } from "./app/styles/theme"
import { ThemeProvider } from "styled-components"


function App() {

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <div></div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

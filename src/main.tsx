import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter as Router} from "react-router-dom"
import { MantineProvider } from '@mantine/core'
import MyContext from './utils/contexts/ReactContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
    <MyContext>
    <Router>
      <App />
    </Router>
    </MyContext>
    </MantineProvider>
  </StrictMode>,
)

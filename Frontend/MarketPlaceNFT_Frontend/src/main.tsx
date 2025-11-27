import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './pages/index.css'
import { BrowserRouter } from 'react-router-dom';
import App from './pages/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

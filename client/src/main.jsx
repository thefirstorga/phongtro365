import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './user/App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminApp from './admin/AdminApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {window.location.pathname.startsWith('/admin') ? <AdminApp /> : <App />}
    </BrowserRouter>
  </StrictMode>,
)
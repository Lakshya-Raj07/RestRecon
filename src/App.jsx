import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useRef } from 'react'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import ReportPage from './pages/ReportPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
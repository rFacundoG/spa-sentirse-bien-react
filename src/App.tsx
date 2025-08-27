import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/client/HomePage'
import ServicesPage from './pages/client/ServicesPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/servicios" element={<ServicesPage />} />
      </Routes>
    </Router>
  )
}

export default App
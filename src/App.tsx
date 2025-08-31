import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/client/HomePage'
import ServicesPage from './pages/client/ServicesPage'
import ProfilePage from './pages/client/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Routes>
    </Router>
  )
}

export default App
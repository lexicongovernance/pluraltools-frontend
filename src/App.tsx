import Landing from './pages/Landing'
import Register from './pages/Register'
import { Routes, Route } from 'react-router-dom'
import PassportPopupRedirect from './pages/Popup'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/popup" element={<PassportPopupRedirect />} />
    </Routes>
  )
}

export default App

import Landing from './pages/Landing'
import { Routes, Route } from 'react-router-dom'
import PassportPopupRedirect from './pages/Popup'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/popup" element={<PassportPopupRedirect />} />
    </Routes>
  )
}

export default App

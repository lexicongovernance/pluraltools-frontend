import Landing from './pages/Landing'
import Register from './pages/Register'
import { Routes, Route } from 'react-router-dom'
import PassportPopupRedirect from './pages/Popup'
import useAuth from './hooks/useAuth'

function App() {
  const { isLogged } = useAuth()
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/register"
        element={isLogged ? <Register /> : <p>Please Log In</p>}
      />
      <Route path="/popup" element={<PassportPopupRedirect />} />
    </Routes>
  )
}

export default App

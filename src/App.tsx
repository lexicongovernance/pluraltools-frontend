import { Routes, Route } from 'react-router-dom'
import useUser from './hooks/useUser'

import Landing from './pages/Landing'
import Register from './pages/Register'
import PassportPopupRedirect from './pages/Popup'

function App() {
  const { user, isLoading } = useUser()

  // This will be a loading skeleton
  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/register"
        element={user ? <Register /> : <h2>Please log in</h2>}
      />
      <Route path="/popup" element={<PassportPopupRedirect />} />
    </Routes>
  )
}

export default App

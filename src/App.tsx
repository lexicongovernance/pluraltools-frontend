import { useQuery } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import Register from './pages/Register'
import PassportPopupRedirect from './pages/Popup'
import fetchUserData from './api/fetchUserData'

function App() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    retry: false,
    staleTime: 10000,
  })
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

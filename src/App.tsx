import Landing from './pages/Landing'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  )
}

export default App

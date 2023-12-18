import { Routes, Route, Navigate } from 'react-router-dom';
import useUser from './hooks/useUser';

import Landing from './pages/Landing';
import Register from './pages/Register';
import PassportPopupRedirect from './pages/Popup';
import Home from './pages/Home';

function App() {
  const { user, isLoading } = useUser();

  // This will be a loading skeleton
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/register" replace /> : <Landing />} />
      <Route path="/home" element={user ? <Home /> : <Navigate to="/" replace />} />
      <Route path="/register" element={user ? <Register /> : <Navigate to="/" replace />} />
      <Route path="/popup" element={<PassportPopupRedirect />} />
    </Routes>
  );
}

export default App;

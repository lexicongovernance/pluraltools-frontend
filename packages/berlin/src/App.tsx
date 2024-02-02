// React and third-party libraries
import { Route, Routes } from 'react-router-dom';

// Pages
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />
    </Routes>
  );
}

export default App;

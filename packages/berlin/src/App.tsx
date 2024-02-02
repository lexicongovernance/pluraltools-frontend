// React and third-party libraries
import { Route, Routes } from 'react-router-dom';

// Pages
import Account from './pages/Account';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import PassportPopupRedirect from './pages/Popup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/account" element={<Account />} />
      <Route path="/popup" element={<PassportPopupRedirect />} />
    </Routes>
  );
}

export default App;

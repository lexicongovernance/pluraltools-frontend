// React and third-party libraries
import { ReactNode, useEffect, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Hooks
import useUser from './hooks/useUser';

// Store
import { useAppStore } from './store';

// Pages
import Account from './pages/Account';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Register from './pages/Register';
import PassportPopupRedirect from './pages/Popup';

function App() {
  const { user, isLoading } = useUser();
  const onboardingStatus = useAppStore((state) => state.onboardingStatus);
  const userStatus = useAppStore((state) => state.userStatus);
  const setUserStatus = useAppStore((state) => state.setUserStatus);

  useEffect(() => {
    // check if user has email and name
    if (user?.username) {
      setUserStatus('COMPLETE');
    }
  }, [user, setUserStatus]);

  const handleHomePage = useMemo((): ReactNode => {
    if (!user) {
      return <Landing />;
    }

    if (onboardingStatus === 'INCOMPLETE') {
      return <Navigate to="/onboarding" />;
    }

    if (userStatus === 'INCOMPLETE') {
      return <Navigate to="/account" />;
    }

    return <Landing />;
  }, [user, userStatus, onboardingStatus]);

  // This will be a loading skeleton
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Routes>
      <Route path="/" element={handleHomePage} />
      <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/" replace />} />
      <Route path="/account" element={user ? <Account /> : <Navigate to="/" replace />} />
      <Route
        path="/events/:eventId/register"
        element={user ? <Register /> : <Navigate to="/" replace />}
      />
      <Route path="/popup" element={<PassportPopupRedirect />} />
    </Routes>
  );
}

export default App;

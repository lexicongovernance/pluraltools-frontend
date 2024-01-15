import { ReactNode, useEffect, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import useUser from './hooks/useUser';
import Account from './pages/Account';
import Event from './pages/Event';
import Events from './pages/Events';
import Landing from './pages/Landing';
import PassportPopupRedirect from './pages/Popup';
import Register from './pages/Register';
import Vote from './pages/Vote';
import { useAppStore } from './store';
import OnboardingPage from './pages/Onboarding';

function App() {
  const { user, isLoading } = useUser();
  const onboardingStatus = useAppStore((state) => state.onboardingStatus);
  const userStatus = useAppStore((state) => state.userStatus);
  const setUserStatus = useAppStore((state) => state.setUserStatus);

  useEffect(() => {
    // check if user has email and name
    if (user?.email && user?.username) {
      setUserStatus('COMPLETE');
    }
  }, [user, setUserStatus]);

  const handleHomePage = useMemo((): ReactNode => {
    if (!user) {
      return <Landing />;
    }

    if (onboardingStatus === 'INCOMPLETE') {
      return <OnboardingPage />;
    }

    if (userStatus === 'INCOMPLETE') {
      return <Navigate to="/account" />;
    }

    if (userStatus === 'COMPLETE') {
      return <Navigate to="/events" />;
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
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/events" element={user ? <Events /> : <Navigate to="/" replace />} />
      <Route path="/events/:eventId" element={user ? <Event /> : <Navigate to="/" replace />} />
      <Route
        path="/events/:eventId/cycles/:cycleId"
        element={user ? <Vote /> : <Navigate to="/" replace />}
      />
      <Route path="/register" element={user ? <Register /> : <Navigate to="/" replace />} />
      <Route path="/account" element={user ? <Account /> : <Navigate to="/" replace />} />
      <Route path="/popup" element={<PassportPopupRedirect />} />
    </Routes>
  );
}

export default App;

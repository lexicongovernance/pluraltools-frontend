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
import Results from './pages/Results';

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
      return <Navigate to="/onboarding" replace />;
    }

    if (userStatus === 'INCOMPLETE') {
      return <Navigate to="/account" replace />;
    }

    if (userStatus === 'COMPLETE') {
      return <Navigate to="/events" replace />;
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
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/events" element={user ? <Events /> : <Navigate to="/" replace />} />
      <Route path="/events/:eventId" element={user ? <Event /> : <Navigate to="/" replace />} />
      <Route
        path="/events/:eventId/register"
        element={user ? <Register /> : <Navigate to="/" replace />}
      />
      <Route
        path="/events/:eventId/cycles/:cycleId"
        element={user ? <Vote /> : <Navigate to="/" replace />}
      />
      <Route
        path="/events/:eventId/cycles/:cycleId/results"
        element={user ? <Results /> : <Navigate to="/" replace />}
      />
      <Route path="/account" element={user ? <Account /> : <Navigate to="/" replace />} />
      <Route path="/popup" element={<PassportPopupRedirect />} />
    </Routes>
  );
}

export default App;

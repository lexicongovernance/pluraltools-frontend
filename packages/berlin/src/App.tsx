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
import PassportPopupRedirect from './pages/Popup';
import Holding from './pages/Holding';
import Register from './pages/Register';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from 'api';
import Communities from './pages/Communities';

function App() {
  const { user, isLoading } = useUser();

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    enabled: !!user?.id,
  });

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

    if (events?.length === 1) {
      return <Navigate to={`/events/${events?.[0].id}/register`} />;
    }

    return <Landing />;
  }, [user, userStatus, onboardingStatus, events]);

  // This will be a loading skeleton
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Routes>
      <Route path="/" element={handleHomePage} />
      <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/" replace />} />
      <Route path="/account" element={user ? <Account /> : <Navigate to="/" replace />} />
      <Route path="/communities" element={user ? <Communities /> : <Navigate to="/" replace />} />
      <Route
        path="/events/:eventId/register"
        element={user ? <Register /> : <Navigate to="/" replace />}
      />
      <Route
        path="/events/:eventId/holding"
        element={user ? <Holding /> : <Navigate to="/" replace />}
      />
      <Route path="/popup" element={<PassportPopupRedirect />} />
    </Routes>
  );
}

export default App;

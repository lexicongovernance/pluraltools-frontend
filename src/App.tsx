import { useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { fetchEvents, fetchRegistration } from './api';
import useUser from './hooks/useUser';
import Account from './pages/Account';
import Event from './pages/Event';
import Events from './pages/Events';
import Landing from './pages/Landing';
import PassportPopupRedirect from './pages/Popup';
import Register from './pages/Register';
import Vote from './pages/Vote';
import { useAppStore } from './store';

function App() {
  const { user, isLoading } = useUser();

  const userStatus = useAppStore((state) => state.userStatus);
  const setUserStatus = useAppStore((state) => state.setUserStatus);
  const registrationStatus = useAppStore((state) => state.registrationStatus);
  const setRegistrationStatus = useAppStore((state) => state.setRegistrationStatus);

  // START OF TEMPORARY REGISTRATION STATUS
  const { data: events } = useQuery({
    queryKey: ['event'],
    queryFn: () => fetchEvents(),
    staleTime: 10000,
    enabled: !!user?.id,
  });
  const { data: registration } = useQuery({
    queryKey: ['registration'],
    queryFn: () => fetchRegistration(events?.[0].id || ''),
    staleTime: 10000,
    enabled: !!events?.[0].id,
  });

  useEffect(() => {
    // check if user has email and name
    if (registration?.id) {
      setRegistrationStatus('COMPLETE');
    }
  }, [registration?.id, setRegistrationStatus]);
  // END OF TEMPORARY REGISTRATION STATUS

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

    if (userStatus === 'INCOMPLETE') {
      return <Navigate to="/account" />;
    }

    if (userStatus === 'COMPLETE' && registrationStatus === 'INCOMPLETE') {
      return <Navigate to="/register" />;
    }

    if (userStatus === 'COMPLETE' && registrationStatus === 'COMPLETE') {
      return <Navigate to="/events" />;
    }

    return <Landing />;
  }, [user, userStatus, registrationStatus]);

  // This will be a loading skeleton
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Routes>
      <Route path="/" element={handleHomePage} />
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

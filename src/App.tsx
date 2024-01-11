import { Routes, Route, Navigate } from 'react-router-dom';
import useUser from './hooks/useUser';
import { useAppStore } from './store';
import Landing from './pages/Landing';
import Register from './pages/Register';
import PassportPopupRedirect from './pages/Popup';
import Home from './pages/Home';
import { ReactNode, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents, fetchRegistration } from './api';

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
      return <Navigate to="/register" />;
    }

    if (userStatus === 'COMPLETE' && registrationStatus === 'INCOMPLETE') {
      return <Navigate to="/register" />;
    }

    if (userStatus === 'COMPLETE' && registrationStatus === 'COMPLETE') {
      return <Navigate to="/home" />;
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
      <Route path="/home" element={user ? <Home /> : <Navigate to="/" replace />} />
      <Route path="/register" element={user ? <Register /> : <Navigate to="/" replace />} />
      <Route path="/popup" element={<PassportPopupRedirect />} />
    </Routes>
  );
}

export default App;

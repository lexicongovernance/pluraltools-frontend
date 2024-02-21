// React and third-party libraries
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';

// Store
import { useAppStore } from './store';

// API
import { fetchCycle, fetchEvents, fetchUserData } from 'api';

// Pages
import { default as BerlinLayout } from './layout/index.ts';
import Account from './pages/Account';
import Cycle from './pages/Cycle.tsx';
import Event from './pages/Event.tsx';
import Events from './pages/Events.tsx';
import Holding from './pages/Holding';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import PassportPopupRedirect from './pages/Popup';
import Register from './pages/Register';
import Results from './pages/Results.tsx';

async function protectedLoader(queryClient: QueryClient) {
  const user = await queryClient.fetchQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    staleTime: 10000,
  });

  if (!user) {
    return redirect('/');
  }
  return null;
}

async function landingLoader(queryClient: QueryClient) {
  const appState = useAppStore.getState();
  const user = await queryClient.fetchQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    retry: 3,
  });
  const events = await queryClient.fetchQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  if (!user) {
    return null;
  }

  if (appState.userStatus === 'INCOMPLETE' && user?.username) {
    useAppStore.setState({ userStatus: 'COMPLETE' });
  }

  if (appState.onboardingStatus === 'INCOMPLETE') {
    return redirect('/onboarding');
  }

  if (appState.userStatus === 'INCOMPLETE') {
    return redirect('/account');
  }

  if (events?.length === 1) {
    return redirect(`/events/${events?.[0].id}/register`);
  }

  return null;
}

async function eventsLoader(queryClient: QueryClient) {
  const events = await queryClient.fetchQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  if (events?.length === 1) {
    return redirect(`/events/${events?.[0].id}`);
  }

  return null;
}

async function cycleLoader(queryClient: QueryClient, eventId?: string, cycleId?: string) {
  const cycle = await queryClient.fetchQuery({
    queryKey: ['cycles', cycleId],
    queryFn: () => fetchCycle(cycleId || ''),
  });

  if (cycle?.status === 'CLOSED') {
    return redirect(`/events/${eventId}/cycles/${cycleId}/results`);
  }

  return null;
}

const router = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      element: <BerlinLayout />,
      children: [
        { path: '/', loader: () => landingLoader(queryClient), element: <Landing /> },
        { path: '/popup', element: <PassportPopupRedirect /> },
        {
          loader: () => protectedLoader(queryClient),
          children: [
            { path: '/onboarding', Component: Onboarding },
            {
              path: '/account',
              Component: Account,
            },
            {
              path: '/events/:eventId/holding',
              Component: Holding,
            },
            {
              path: '/events/:eventId/register',
              Component: Register,
            },
            {
              loader: () => eventsLoader(queryClient),
              path: '/events',
              Component: Events,
            },
            {
              path: '/events/:eventId',
              Component: Event,
            },
            {
              loader: ({ params }) => cycleLoader(queryClient, params.eventId, params.cycleId),
              path: '/events/:eventId/cycles/:cycleId',
              Component: Cycle,
            },
            {
              path: '/events/:eventId/cycles/:cycleId/results',
              Component: Results,
            },
          ],
        },
      ],
    },
  ]);

function App({ queryClient }: { queryClient: QueryClient }) {
  return <RouterProvider router={router(queryClient)} />;
}

export default App;

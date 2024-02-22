// React and third-party libraries
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';

// Store
import { useAppStore } from './store';

// API
import { fetchEvents, fetchUserData, fetchCycle } from 'api';

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

async function userIsLoggedInLoader(queryClient: QueryClient) {
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

async function userIsCompleteLoader(queryClient: QueryClient) {
  const user = await queryClient.fetchQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
  });

  if (user?.username) {
    useAppStore.setState({ userStatus: 'COMPLETE' });
    return null;
  } else {
    useAppStore.setState({ userStatus: 'INCOMPLETE' });
    return redirect('/account');
  }
}

async function landingLoader(queryClient: QueryClient) {
  const user = await queryClient.fetchQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
  });

  const events = await queryClient.fetchQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  if (!user) {
    return null;
  }

  const userIsComplete = await userIsCompleteLoader(queryClient);

  if (userIsComplete) {
    return userIsComplete;
  }

  if (events?.length === 1) {
    console.log('landing: redirecting to cycles');
    return redirect(`/events/${events?.[0].id}/cycles`);
  }

  return null;
}

async function eventsLoader(queryClient: QueryClient) {
  const events = await queryClient.fetchQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  if (events?.length === 1) {
    return redirect(`/events/${events?.[0].id}/cycles`);
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
          loader: () => userIsLoggedInLoader(queryClient),
          children: [
            { path: '/onboarding', Component: Onboarding },
            {
              path: '/account',
              Component: Account,
            },

            {
              loader: () => userIsCompleteLoader(queryClient),
              path: '/events',
              children: [
                {
                  loader: () => eventsLoader(queryClient),
                  path: '',
                  Component: Events,
                },
                {
                  path: ':eventId/register',
                  Component: Register,
                },
                {
                  path: ':eventId/holding',
                  Component: Holding,
                },
                {
                  path: ':eventId/cycles',
                  children: [
                    {
                      path: '',
                      Component: Event,
                    },
                    {
                      loader: ({ params }) =>
                        cycleLoader(queryClient, params.eventId, params.cycleId),
                      path: ':cycleId',
                      Component: Cycle,
                    },
                    {
                      path: ':cycleId/results',
                      Component: Results,
                    },
                  ],
                },
              ],
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

// React and third-party libraries
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';

// Store
import { useAppStore } from './store';

// API
import { fetchEvents, fetchUser, fetchCycle, fetchRegistrations } from 'api';

// Pages
import { default as BerlinLayout } from './layout/index.ts';
import Account from './pages/Account';
import Cycle from './pages/Cycle.tsx';
import DataPolicy from './pages/DataPolicy.tsx';
import Event from './pages/Event.tsx';
import Events from './pages/Events.tsx';
import Holding from './pages/Holding';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Comments from './pages/Comments.tsx';
import PassportPopupRedirect from './pages/Popup';
import PublicGroupRegistration from './pages/PublicGroupRegistration.tsx';
import Register from './pages/Register';
import Results from './pages/Results.tsx';
import SecretGroupRegistration from './pages/SecretGroupRegistration.tsx';

/**
 * Redirects the user to the landing page if they are not logged in
 */
async function redirectToLandingLoader(queryClient: QueryClient) {
  const user = await queryClient.fetchQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 10000,
  });

  if (!user) {
    return redirect('/');
  }
  return null;
}

/**
 * Redirects the user to the account page if they have not completed their profile
 */
async function redirectToAccount(queryClient: QueryClient) {
  const user = await queryClient.fetchQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  if (user?.username) {
    useAppStore.setState({ userStatus: 'COMPLETE' });
    return null;
  }

  useAppStore.setState({ userStatus: 'INCOMPLETE' });
  return redirect('/account');
}

/**
 * Redirects the user to the landing page to cycles or account page
 */
async function redirectOnLandingLoader(queryClient: QueryClient) {
  const user = await queryClient.fetchQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  if (!user) {
    return null;
  }

  const onboardingState = useAppStore.getState().onboardingStatus;

  if (onboardingState === 'INCOMPLETE') {
    return redirect('/onboarding');
  }

  const events = await queryClient.fetchQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  const userIsComplete = await redirectToAccount(queryClient);

  if (userIsComplete) {
    return userIsComplete;
  }

  if (events?.length === 1) {
    const registrations = await queryClient.fetchQuery({
      queryKey: ['event', events?.[0].id, 'registrations'],
      queryFn: () => fetchRegistrations(events?.[0].id || ''),
    });

    if (registrations && registrations.some((registration) => registration.status === 'APPROVED')) {
      return redirect(`/events/${events?.[0].id}/register`);
    }

    return redirect(`/events/${events?.[0].id}/cycles`);
  }

  return null;
}

/**
 * Redirects the user to the only event if there is only one event
 */
async function redirectToOnlyOneEventLoader(queryClient: QueryClient) {
  const events = await queryClient.fetchQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  if (events?.length === 1) {
    return redirect(`/events/${events?.[0].id}/cycles`);
  }

  return null;
}

/**
 * Redirects the user to the register page if they are not registered
 * Redirects the user to the holding page if they don't have any approved registrations
 */
async function redirectToEventHoldingOrRegister(queryClient: QueryClient, eventId?: string) {
  const registrations = await queryClient.fetchQuery({
    queryKey: ['event', eventId, 'registrations'],
    queryFn: () => fetchRegistrations(eventId || ''),
  });

  if (!registrations || !registrations.length) {
    return redirect(`/events/${eventId}/register`);
  }

  if (!registrations.some((registration) => registration.status === 'APPROVED')) {
    return redirect(`/events/${eventId}/holding`);
  }

  return null;
}

/**
 * Redirects the user to the results page if the cycle is closed
 */
async function redirectToCycleResultsLoader(
  queryClient: QueryClient,
  eventId?: string,
  cycleId?: string,
) {
  const cycle = await queryClient.fetchQuery({
    queryKey: ['cycles', cycleId],
    queryFn: () => fetchCycle(cycleId || ''),
  });

  if (cycle?.status === 'CLOSED') {
    return redirect(`/events/${eventId}/cycles/${cycleId}/results`);
  }

  return null;
}

/**
 * Redirects the user to the cycle page if the cycle is open
 */
async function redirectToCycleIfOpen(queryClient: QueryClient, eventId?: string, cycleId?: string) {
  const cycle = await queryClient.fetchQuery({
    queryKey: ['cycles', cycleId],
    queryFn: () => fetchCycle(cycleId || ''),
  });

  if (cycle?.status === 'OPEN') {
    return redirect(`/events/${eventId}/cycles/${cycleId}`);
  }

  return null;
}

const router = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/popup',
      element: <PassportPopupRedirect />,
    },
    {
      element: <BerlinLayout />,
      children: [
        {
          path: '/',
          loader: () => redirectOnLandingLoader(queryClient),
          element: <Landing />,
        },
        {
          loader: () => redirectToLandingLoader(queryClient),
          children: [
            {
              path: '/onboarding',
              Component: Onboarding,
            },
            {
              path: '/data-policy',
              Component: DataPolicy,
            },
            {
              path: '/account',
              Component: Account,
            },
            {
              path: '/secret-groups',
              Component: SecretGroupRegistration,
            },
            {
              path: '/public-groups',
              Component: PublicGroupRegistration,
            },
            {
              loader: () => redirectToAccount(queryClient),
              path: '/events',
              children: [
                {
                  loader: () => redirectToOnlyOneEventLoader(queryClient),
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
                  loader: ({ params }) =>
                    redirectToEventHoldingOrRegister(queryClient, params.eventId),
                  path: ':eventId/cycles',
                  children: [
                    {
                      path: '',
                      Component: Event,
                    },
                    {
                      loader: ({ params }) =>
                        redirectToCycleResultsLoader(queryClient, params.eventId, params.cycleId),
                      path: ':cycleId',
                      Component: Cycle,
                    },
                    {
                      loader: ({ params }) =>
                        redirectToCycleIfOpen(queryClient, params.eventId, params.cycleId),
                      path: ':cycleId/results',
                      Component: Results,
                    },
                    {
                      path: ':cycleId/options/:optionId',
                      Component: Comments,
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

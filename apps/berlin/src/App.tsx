// React and third-party libraries
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';

// Store
import { useAppStore } from './store/index.ts';

// API
import { fetchEvents, fetchUserData, fetchCycle, fetchRegistration } from 'api';

// Pages
import { default as BerlinLayout } from './layout/index.ts';
import Account from './pages/Account.tsx';
import Cycle from './pages/Cycle.tsx';
import DataPolicy from './pages/DataPolicy.tsx';
import Event from './pages/Event.tsx';
import Events from './pages/Events.tsx';
import Holding from './pages/Holding.tsx';
import Landing from './pages/Landing.tsx';
import Onboarding from './pages/Onboarding.tsx';
import Option from './pages/Option.tsx';
import PassportPopupRedirect from './pages/Popup.tsx';
import Register from './pages/Register.tsx';
import Results from './pages/Results.tsx';

/**
 * Redirects the user to the landing page if they are not logged in
 */
async function redirectToLandingLoader(queryClient: QueryClient) {
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

/**
 * Redirects the user to the account page if they have not completed their profile
 */
async function redirectToAccount(queryClient: QueryClient) {
  const user = await queryClient.fetchQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
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
    queryFn: fetchUserData,
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
 * Redirects the user to the holding page if they in DRAFT STATUS
 */
async function redirectToEventHoldingOrRegister(queryClient: QueryClient, eventId?: string) {
  const registration = await queryClient.fetchQuery({
    queryKey: ['event', eventId, 'registration'],
    queryFn: () => fetchRegistration(eventId || ''),
  });

  if (!registration) {
    return redirect(`/events/${eventId}/register`);
  }

  if (registration?.status !== 'APPROVED') {
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

const router = (queryClient: QueryClient) =>
  createBrowserRouter([
    { path: '/popup', element: <PassportPopupRedirect /> },
    {
      element: <BerlinLayout />,
      children: [
        { path: '/', loader: () => redirectOnLandingLoader(queryClient), element: <Landing /> },
        {
          loader: () => redirectToLandingLoader(queryClient),
          children: [
            { path: '/onboarding', Component: Onboarding },
            { path: '/data-policy', Component: DataPolicy },
            {
              path: '/account',
              Component: Account,
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
                  path: ':eventId/cycles',
                  loader: ({ params }) =>
                    redirectToEventHoldingOrRegister(queryClient, params.eventId),
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
                      path: ':cycleId/results',
                      Component: Results,
                    },
                    {
                      path: ':cycleId/options/:optionId',
                      Component: Option,
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

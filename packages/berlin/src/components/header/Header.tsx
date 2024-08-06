// React and third-party libraries
import { useMemo, useState } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Menu, User } from 'lucide-react';

// API
import {
  fetchEventNavLinks,
  fetchNavLinks,
  fetchUserRegistrations,
  GetUserResponse,
  logout,
} from 'api';

// Hooks
import { useAppStore } from '@/store';
import useUser from '@/hooks/useUser';

// Components
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/_components/ui/navigation-menu';
import Icon from '../icon';
import ThemeToggler from '../theme-toggler';
import ZupassLoginButton from '../zupass-button';

export default function Header() {
  const theme = useAppStore((state) => state.theme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <header className="bg-primary border-secondary border-b text-sm">
      {isMenuOpen && (
        <NavigationMenu
          className="font-raleway bg-primary absolute z-20 mt-[65px] flex h-full flex-col items-center justify-center uppercase"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <NavigationMenuList className="w-screen flex-col gap-5">
            {user && <HeaderLinks user={user} />}
            <UserMenuLinks />
          </NavigationMenuList>
        </NavigationMenu>
      )}
      <section className="mx-auto flex min-h-16 w-[min(90%,1080px)] items-center justify-between">
        <div className="flex cursor-pointer items-center gap-2" onClick={() => navigate('/')}>
          <img src={`/logos/lexicon-${theme}.svg`} alt="Lexicon Logo" height={32} width={32} />
          <h1 className="text-2xl font-semibold leading-6">Plural Voting</h1>
        </div>
        <NavigationMenu className="font-raleway uppercase">
          <NavigationMenuList className="gap-3">
            {user ? (
              <>
                <div className="hidden gap-3 md:flex">
                  <HeaderLinks user={user} />
                  <UserMenu />
                </div>
                <div className="md:hidden">
                  <Icon onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Menu />
                  </Icon>
                </div>
              </>
            ) : (
              <ZupassLoginButton style={{ fontSize: '14px', lineHeight: '14px' }}>
                Login
              </ZupassLoginButton>
            )}
            <NavigationMenuItem>
              <NavigationMenuLink>
                <ThemeToggler />
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </section>
    </header>
  );
}

const HeaderLinks = ({ user }: { user: GetUserResponse }) => {
  const { eventId } = useParams();

  const { data: registrationsData } = useQuery({
    queryKey: [user?.id, 'registrations'],
    queryFn: () =>
      fetchUserRegistrations({
        userId: user?.id ?? '',
        serverUrl: import.meta.env.VITE_SERVER_URL,
      }),
    enabled: !!user,
  });

  const { data: navLinks } = useQuery({
    queryKey: ['navLinks'],
    queryFn: () => fetchNavLinks({ serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!user,
    refetchInterval: 10000,
  });

  const { data: eventNavLinks } = useQuery({
    queryKey: ['event', eventId, 'navLinks'],
    queryFn: () =>
      fetchEventNavLinks({ serverUrl: import.meta.env.VITE_SERVER_URL, eventId: eventId || '' }),
    enabled: !!user && !!eventId,
    refetchInterval: 10000,
  });

  const links = useMemo(() => {
    if (eventId) {
      // User is within an event
      const approvedRegistration =
        registrationsData
          ?.filter((reg) => reg.eventId === eventId)
          .some((registration) => registration.status === 'APPROVED') ?? false;

      const eventBaseLinks = [
        {
          title: 'Registration',
          link: `/events/${eventId}/register`,
        },
        {
          title: 'Agenda',
          link: `/events/${eventId}/cycles`,
        },
      ];

      const fetchedEventNavLinks = eventNavLinks?.map(({ title, link }) => ({ title, link })) ?? [];

      return approvedRegistration ? [...fetchedEventNavLinks, ...eventBaseLinks] : [];
    } else {
      // User is outside of an event
      const baseLinks = [
        {
          title: 'Events',
          link: `/events`,
        },
      ];

      const fetchedNavLinks = navLinks?.map(({ title, link }) => ({ title, link })) ?? [];

      return [...fetchedNavLinks, ...baseLinks];
    }
  }, [eventId, eventNavLinks, navLinks, registrationsData]);

  return links.map(({ title, link }) => (
    <NavigationMenuItem key={title}>
      <NavigationMenuLink asChild>
        <NavLink
          to={link || ''}
          className="border-secondary aria-[current=page]:border-b-2 aria-[current=page]:pb-1"
        >
          {title}
        </NavLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  ));
};

const UserMenu = () => {
  return (
    <NavigationMenuItem className="relative">
      <NavigationMenuTrigger className="flex">
        <Icon>
          <User />
        </Icon>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuList className="flex flex-col gap-4 p-4">
          <UserMenuLinks />
        </NavigationMenuList>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

const UserMenuLinks = () => {
  const queryClient = useQueryClient();
  const resetState = useAppStore((state) => state.reset);
  const navigate = useNavigate();

  const { mutate: mutateLogout } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      resetState();
      await queryClient.invalidateQueries();
      await queryClient.removeQueries();
      navigate('/');
    },
  });
  const links = useMemo(() => {
    return [
      {
        title: 'Account',
        link: '/account',
      },
      {
        title: 'Log out',
        onClick: () => mutateLogout({ serverUrl: import.meta.env.VITE_SERVER_URL }),
      },
    ];
  }, [mutateLogout]);

  return links.map(({ title, link, onClick }) => (
    <NavigationMenuItem key={title}>
      <NavigationMenuLink asChild>
        <NavLink
          to={link || ''}
          onClick={onClick}
          className="border-secondary aria-[current=page]:border-b-2 aria-[current=page]:pb-1"
        >
          {title}
        </NavLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  ));
};

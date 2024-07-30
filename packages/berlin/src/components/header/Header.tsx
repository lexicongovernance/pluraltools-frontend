import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/_components/ui/navigation-menu';
import useUser from '@/hooks/useUser';
import { useAppStore } from '@/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAlerts, fetchEvents, fetchUserRegistrations, GetUserResponse, logout } from 'api';
import { Menu, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../icon';
import ThemeToggler from '../theme-toggler';
import { useNavigate } from 'react-router-dom';
import ZupassLoginButton from '../zupass-button';

export default function NewHeader() {
  const theme = useAppStore((state) => state.theme);
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="flex items-center gap-2">
          <img src={`/logos/lexicon-${theme}.svg`} alt="Lexicon Logo" height={32} width={32} />
          <h1 className="text-2xl font-semibold leading-6">Lexicon</h1>
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
              <ZupassLoginButton>Login</ZupassLoginButton>
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
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents({ serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!user,
  });

  const { data: registrationsData } = useQuery({
    queryKey: [user?.id, 'registrations'],
    queryFn: () =>
      fetchUserRegistrations({
        userId: user?.id ?? '',
        serverUrl: import.meta.env.VITE_SERVER_URL,
      }),
    enabled: !!user,
  });

  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => fetchAlerts({ serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!user,
    refetchInterval: 10000,
  });

  const links = useMemo(() => {
    const baseLinks = [
      {
        title: 'My Proposals',
        link: events ? `/events/${events?.[0].id}/register` : '',
      },
      {
        title: 'Agenda',
        link: events ? `/events/${events?.[0].id}/cycles` : '',
      },
    ];

    if (
      registrationsData?.some((registration) => registration.status === 'APPROVED') &&
      alerts &&
      alerts.length > 0
    ) {
      const alertsLinks = alerts.map((alert) => ({
        title: alert.title,
        link: alert.link || '',
      }));
      return [...baseLinks, ...alertsLinks];
    }

    return baseLinks;
  }, [events, registrationsData, alerts]);

  return links.map(({ title, link }) => (
    <NavigationMenuItem key={title}>
      <NavigationMenuLink asChild>
        <NavLink
          to={link}
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

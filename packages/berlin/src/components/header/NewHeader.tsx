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
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from 'api';
import { User } from 'lucide-react';
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../icon';
import ThemeToggler from '../theme-toggler';

const HeaderLinks = () => {
  const { user } = useUser();
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    enabled: !!user,
  });
  const links = useMemo(
    () => [
      {
        title: 'My Proposals',
        to: `/events/${events?.[0].id}/register`,
      },
      {
        title: 'Agenda',
        to: `/events/${events?.[0].id}/cycles`,
      },
    ],
    [events],
  );

  return (
    <>
      {links.map((link) => (
        <NavigationMenuItem key={link.to}>
          <NavigationMenuLink>
            <NavLink to={link.to}>{link.title}</NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </>
  );
};

const UserMenu = () => (
  <NavigationMenuItem>
    <NavigationMenuTrigger className="flex">
      <Icon>
        <User />
      </Icon>
    </NavigationMenuTrigger>
    <NavigationMenuContent className="bg-primary flex flex-col p-4">
      <NavigationMenuLink>
        <NavLink to="/account">Account</NavLink>
      </NavigationMenuLink>
      <NavigationMenuLink>Log out</NavigationMenuLink>
    </NavigationMenuContent>
  </NavigationMenuItem>
);

export default function NewHeader() {
  const theme = useAppStore((state) => state.theme);

  return (
    <header className="bg-primary border-secondary border-b">
      <section className="mx-auto flex min-h-16 w-[min(90%,1080px)] items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={`/logos/lexicon-${theme}.svg`} alt="Lexicon Logo" height={32} width={32} />
          <h1 className="text-2xl font-semibold leading-6">Lexicon</h1>
        </div>
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <HeaderLinks />
            <UserMenu />
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

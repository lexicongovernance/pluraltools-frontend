export function TabsManager<T extends string>({
  tabs,
  tab,
  fallback,
}: {
  tabs: {
    [key in T]?: React.ReactNode;
  };
  tab: T;
  fallback: React.ReactNode;
}) {
  return tabs[tab] || fallback;
}

export function TabManager<T extends string>({
  tabs,
  tab,
}: {
  tabs: {
    [key in T]: React.ReactNode;
  };
  tab: T;
}) {
  return tabs[tab];
}

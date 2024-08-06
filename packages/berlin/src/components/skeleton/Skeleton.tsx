import { useAppStore } from '@/store';

export default function Skeleton({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const theme = useAppStore((state) => state.theme);
  return (
    <div className={`${className} animate-pulse ${theme === 'dark' ? 'bg-[#333]' : 'bg-[#eee]'}`} />
  );
}

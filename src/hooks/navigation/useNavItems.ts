import { usePathname } from 'next/navigation';

export default function useNavItems<T extends { url: string }>(items: T[]) {
  const pathname = usePathname();
  return items.map((item) => ({
    ...item,
    current: pathname === item.url || pathname.startsWith(item.url),
  }));
}

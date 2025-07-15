import { usePathname } from 'next/navigation';
import type { NavLink } from '@/lib/types';

export default function useNavLinks(links: NavLink[]) {
  const pathname = usePathname();
  return links.map((link) => ({
    ...link,
    current: pathname === link.url,
  }));
}

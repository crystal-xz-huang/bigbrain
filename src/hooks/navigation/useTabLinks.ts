import { usePathname } from 'next/navigation';
import type { TabLink } from '@/lib/types';

export default function useTabLinks(tabs: TabLink[]) {
  const pathname = usePathname();
  return tabs.map((tab) => ({
    ...tab,
    current: pathname === tab.href,
  }));
}

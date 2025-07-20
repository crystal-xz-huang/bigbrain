import { redirect } from 'next/navigation';
import { routes } from '@/lib/routes';

export default function DashboardPage() {
  redirect(routes.games);
}

import SignOutModal from '@/components/modals/signout';
import { verifyUser } from '@/lib/data/auth';

export default async function SignOutPage() {
  const user = await verifyUser();
  return <SignOutModal user={user} />;
}

import Modal from '@/components/modals/signout';
import { verifyUser } from '@/lib/data/auth';

export default async function SignOutModal() {
  const user = await verifyUser();
  return <Modal user={user} />;
}

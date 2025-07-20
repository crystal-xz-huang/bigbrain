import { PageHeading } from '@/components/admin/layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
}

export default async function ProfilePage() {
  return (
    <PageHeading heading='Profile'/>
  );
}

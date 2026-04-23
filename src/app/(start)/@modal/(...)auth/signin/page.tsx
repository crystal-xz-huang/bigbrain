'use client';

import { SignInForm } from '@/components/auth/signin';
import { Dialog } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export default function SignInModal() {
  const router = useRouter();

  return (
    <Dialog open onClose={() => router.back()}>
      <div className="w-full max-w-sm mx-auto">
        <SignInForm />
      </div>
    </Dialog>
  );
}

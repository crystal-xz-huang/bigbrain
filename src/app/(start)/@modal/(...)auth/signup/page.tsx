'use client';

import { SignUpForm } from '@/components/auth/signup';
import { Dialog } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  return (
    <Dialog open onClose={() => router.back()}>
      <div className="w-full max-w-sm mx-auto">
        <SignUpForm />
      </div>
    </Dialog>
  );
}

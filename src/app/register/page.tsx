import { AuthLayout } from '@/components/ui/auth-layout';
import { Suspense } from 'react';
import { Metadata } from 'next';
import SignUp from '@/components/auth/sign-up';

export const metadata: Metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Suspense>
        <SignUp />
      </Suspense>
    </AuthLayout>
  );
}

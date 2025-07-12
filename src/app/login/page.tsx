import { AuthLayout } from '@/components/ui/auth-layout';
import { Suspense } from 'react';
import { Metadata } from 'next';
import SignIn from '@/components/auth/sign-in';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense>
        <SignIn />
      </Suspense>
    </AuthLayout>
  );
}

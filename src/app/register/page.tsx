import { AuthLayout } from '@/components/ui/auth-layout';
import { Metadata } from 'next';
import SignUp from '@/components/auth/signup';

export const metadata: Metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
}

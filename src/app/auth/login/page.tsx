import { Metadata } from 'next';
import SignIn from '@/components/auth/signin';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return <SignIn />;
}

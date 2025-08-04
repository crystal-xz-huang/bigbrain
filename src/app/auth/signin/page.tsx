import { Metadata } from 'next';
import SignIn from '@/components/ui/auth/signin';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function SignInPage() {
  return <SignIn />;
}

import { Metadata } from 'next';
import { SignInForm } from '@/components/auth/signin';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function SignInPage() {
  return <SignInForm />;
}

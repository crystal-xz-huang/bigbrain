import { Metadata } from 'next';
import SignUp from '@/components/auth/signup';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignUpPage() {
  return <SignUp />;
}

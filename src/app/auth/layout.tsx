import { AuthLayout } from '@/components/ui/auth-layout';

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
}

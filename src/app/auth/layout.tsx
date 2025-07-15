import { AuthLayout } from '@/components/ui/auth-layout';
import { Suspense } from 'react';

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthLayout>
      <Suspense>
        {children}
      </Suspense>
    </AuthLayout>
  );
}

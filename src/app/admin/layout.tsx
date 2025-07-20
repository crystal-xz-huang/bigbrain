import { auth } from '@/auth';
import { Navbar, Sidebar } from '@/components/admin/layout';
import { SidebarLayout } from '@/components/ui/sidebar-layout';
import { routes } from '@/lib/routes';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect(routes.signin);
  const user = session?.user;

  return (
    <SidebarLayout
      sidebar={<Sidebar user={user} />}
      navbar={<Navbar user={user} />}
    >
      <div className="container mx-auto mt-6">
        {children}
      </div>
    </SidebarLayout>
  );
}

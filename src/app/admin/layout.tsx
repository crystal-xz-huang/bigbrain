import { auth } from '@/auth';
import { Navbar, Sidebar } from '@/components/navigation';
import { SidebarLayout } from '@/components/ui/sidebar-layout';
import { SidebarProvider } from '@/hooks/sidebar';
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
    <SidebarProvider>
      <SidebarLayout
        sidebar={<Sidebar user={user} />}
        navbar={<Navbar user={user} />}
      >
        <div className="container mx-auto">{children}</div>
      </SidebarLayout>
    </SidebarProvider>
  );
}

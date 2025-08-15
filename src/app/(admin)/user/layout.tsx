import { Navbar, Sidebar } from '@/components/ui/navigation/user';
import { SidebarLayout } from '@/components/ui/sidebar-layout';
import { SidebarProvider } from '@/hooks/sidebar';
import { getUser } from '@/lib/dal';
import React from 'react';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

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

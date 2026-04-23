import { Navbar, Sidebar } from '@/components/ui/navigation/shell';
import { SidebarLayout } from '@/components/ui/navigation/shell/sidebar-layout';
import { SidebarProvider } from '@/hooks/sidebar';
import { getUserOrNull } from '@/lib/data/auth';
import React from 'react';

export default async function Layout({
  modal,
  children,
}: {
  modal: React.ReactNode;
  children: React.ReactNode;
}) {
  const user = await getUserOrNull();

  return (
    <SidebarProvider>
      <SidebarLayout
        sidebar={<Sidebar user={user} />}
        navbar={<Navbar user={user} />}
      >
        {children}
        {modal}
      </SidebarLayout>
    </SidebarProvider>
  );
}

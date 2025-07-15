import { auth } from "@/auth";
import { SidebarLayout } from '@/components/ui/sidebar-layout'
import { Navbar, Sidebar } from '@/components/dashboard';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <SidebarLayout
      sidebar={<Sidebar user={user} />}
      navbar={<Navbar user={user} />}
    >
      <div className="container mx-auto mt-6">{children}</div>
    </SidebarLayout>
  )
}

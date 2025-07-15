import SignOut from "@/components/auth/signout";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <div className="flex h-full w-full items-center justify-center flex-col">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4 text-gray-600">Welcome to your dashboard!</p>
    </div>
  );
}

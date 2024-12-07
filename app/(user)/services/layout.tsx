import AppSidebar from '@/components/layout/app-sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CandyData - Dashboard',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className=' h-screen bg-white-950'>
        <AppSidebar>{children}</AppSidebar>
      </div>
    </>
  );
}

import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';

import AppSidebar from '@/components/staff/sidebar/AppSidebar';
import SidebarContent from '@/components/staff/sidebar/SidebarContent';
import { getUserToken } from '@/lib/actions/auth.action';
import { notFound } from 'next/navigation';

const BooksHomePage = async ({ children }: { children: ReactNode }) => {
  const user = await getUserToken();
  if (!user) {
    return notFound();
  }
  return (
    <>
      <SidebarProvider>
        <AppSidebar auth={user} />
        <SidebarContent>{children}</SidebarContent>
      </SidebarProvider>
    </>
  );
};

export default BooksHomePage;

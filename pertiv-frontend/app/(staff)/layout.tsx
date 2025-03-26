import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';

import AppSidebar from '@/components/staff/sidebar/AppSidebar';
import SidebarContent from '@/components/staff/sidebar/SidebarContent';

const BooksHomePage = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarContent>{children}</SidebarContent>
      </SidebarProvider>
    </>
  );
};

export default BooksHomePage;

import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';

import AppSidebar from '@/components/books/AppSidebar';
import SidebarContent from '@/components/books/SidebarContent';

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

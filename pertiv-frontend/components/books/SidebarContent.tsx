import { ReactNode } from 'react';

import { SidebarInset } from '@/components/ui/sidebar';
import Header from './Header';

const SidebarContent = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarInset>
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <main>{children}</main>
      </div>
    </SidebarInset>
  );
};

export default SidebarContent;

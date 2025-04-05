'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Book, LayoutDashboard, ScrollText } from 'lucide-react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { useSearchParams } from 'next/navigation';

const AppSidebar = () => {
  const search = useSearchParams();
  const modeParams = search.get('mode');
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/staff" className="flex gap-2 items-center">
                    <LayoutDashboard />
                    <span>Dashboard overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={
                      modeParams
                        ? `/staff/books?mode=${modeParams}`
                        : '/staff/books'
                    }
                    className="flex gap-2 items-center"
                  >
                    <Book />
                    <span>Manage Books</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={
                      modeParams
                        ? `/staff/transactions?mode=${modeParams}`
                        : '/staff/transactions'
                    }
                    className="flex gap-2 items-center"
                  >
                    <ScrollText />
                    <span>Manage Transaction</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

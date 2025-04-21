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
import {
  Book,
  LayoutDashboard,
  LibraryBig,
  ScrollText,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { usePathname, useSearchParams } from 'next/navigation';
import { AuthUser } from '@/model/auth.model';

interface Props {
  auth: AuthUser | null | undefined;
}
const AppSidebar = ({ auth }: Props) => {
  const search = useSearchParams();
  const modeParams = search.get('mode');
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center justify-center gap-2 rounded-md p-2 ">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-zinc-200">
                    <LibraryBig size="15" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold">PERTIV</span>
                  </div>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/staff'}>
                  <Link href="/staff" className="flex gap-2 items-center">
                    <LayoutDashboard />
                    <span>Dashboard overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/staff/books'}
                >
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
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/staff/transactions'}
                >
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
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/staff/membership'}
                >
                  <Link
                    href="/staff/membership"
                    className="flex gap-2 items-center"
                  >
                    <Users />
                    <span>Manage Membership</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton auth={auth} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

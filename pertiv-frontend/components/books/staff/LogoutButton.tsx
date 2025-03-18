'use client';

import { ChevronsUpDown, LogOut } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { deleteCookie, getUserToken } from '@/lib/actions/auth.action';
import { useRouter } from 'next/navigation';

type AuthUser = {
  id: unknown;
  email: unknown;
  name: unknown;
  role: unknown;
  image: unknown;
  is_penalty: unknown;
  token: string;
};

const LogoutButton = () => {
  const { isMobile } = useSidebar();
  const [auth, setAuth] = useState<AuthUser | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getAuth = async () => {
      const user = await getUserToken();
      setAuth(user);
    };

    getAuth();
  }, []);

  const logoutBtnHandler = async () => {
    await deleteCookie();
    router.push('/login');
    setAuth(null);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="h-8 w-8 bg-red-500 rounded-full"></div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {(auth?.name as string) || ''}
                </span>
                <span className="truncate text-xs">
                  {(auth?.email as string) || ''}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={() => logoutBtnHandler()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default LogoutButton;

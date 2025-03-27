'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteCookie, getUserToken } from '@/lib/actions/auth.action';
import { AuthUser } from '@/model/auth.model';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const AdminNavbar = () => {
  const [auth, setAuth] = useState<AuthUser | null | undefined>(null);
  const router = useRouter();
  useEffect(() => {
    const getAuth = async () => {
      const user = await getUserToken();
      setAuth(user);
    };

    getAuth();
  }, []);
  const logoutHandler = async () => {
    await deleteCookie();
    router.push('/login');
    setTimeout(() => {
      setAuth(null);
    }, 3000);
  };
  return (
    <header>
      <nav className="bg-blue-700">
        <div className="container px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4 text-white tracking-wide">
              <Link href="/admin" className="text-lg font-bold tracking-wider">
                PERTIV
              </Link>
            </div>
            {auth && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="rounded-full">
                    <div className="size-8 rounded-full bg-red-500"></div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <p>Hi, {String(auth?.name)}</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <div onClick={() => logoutHandler()}>Logout</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;

'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteCookie } from '@/lib/actions/auth.action';

const AdminNavbar = () => {
  const router = useRouter();
  const logoutHandler = async () => {
    await deleteCookie();
    console.log('before redirect');
    router.push('/login');

    console.log('after redirect');
  };
  return (
    <header>
      <nav className="bg-blue-700">
        <div className="container px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex space-x-4">
              <p className="text-white">Hi, Admin</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="rounded-full">
                  <div className="size-8 rounded-full bg-red-500"></div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer">
                  <div onClick={() => logoutHandler()}>Logout</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;

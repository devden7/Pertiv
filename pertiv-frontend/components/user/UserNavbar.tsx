'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteCookie } from '@/lib/actions/auth.action';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const UserNavbar = () => {
  const router = useRouter();
  const logoutHandler = async () => {
    await deleteCookie();
    router.push('/login');
  };
  return (
    <header>
      <nav className="bg-blue-700">
        <div className="container px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex space-x-4">
              <p className="text-white">Hi, User</p>
            </div>
            <div className="flex gap-4 items-center">
              <Link href="/cart">
                <ShoppingCart color="white" />
              </Link>
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
        </div>
      </nav>
    </header>
  );
};

export default UserNavbar;

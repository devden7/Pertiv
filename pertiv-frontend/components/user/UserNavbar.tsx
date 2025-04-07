'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteCookie, getUserToken } from '@/lib/actions/auth.action';
import { BookMarked, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AuthUser } from '@/model/auth.model';

const UserNavbar = () => {
  const [isOpenNavbar, setIsOpenNavbar] = useState(false);
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
              <Link href="/" className="text-lg font-bold tracking-wider">
                PERTIV
              </Link>
            </div>
            {auth && (
              <div className="flex gap-4 items-center text-white font-medium">
                <Link href="/transactions">Transaction</Link>
                <DropdownMenu
                  open={isOpenNavbar}
                  onOpenChange={setIsOpenNavbar}
                >
                  <DropdownMenuTrigger>Collection</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link
                        href="/cart"
                        className="flex gap-2 items-center"
                        onClick={() => setIsOpenNavbar(false)}
                      >
                        <ShoppingCart color="black" size={15} />
                        <span>Cart</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link
                        href="/loan-cart"
                        className="flex gap-2 items-center"
                        onClick={() => setIsOpenNavbar(false)}
                      >
                        <BookMarked color="black" size={15} />
                        <span>Loan cart</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

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
              </div>
            )}
            {!auth && (
              <Link
                href="/login"
                className="bg-white py-2 px-4 rounded-md font-semibold text-zinc-800 "
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default UserNavbar;

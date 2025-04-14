'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteCookie } from '@/lib/actions/auth.action';
import { BookMarked, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AuthUser } from '@/model/auth.model';
import { formatDateTime } from '@/utils/formatDateTime';
import { IUserInfo } from '@/model/user.model';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

interface Props {
  userInfo: IUserInfo;
  auth: AuthUser | null | undefined;
}
const UserNavbar = ({ userInfo, auth }: Props) => {
  const [isOpenNavbar, setIsOpenNavbar] = useState(false);
  const router = useRouter();

  const logoutHandler = async () => {
    await deleteCookie();
    router.push('/');
  };

  return (
    <>
      {auth && userInfo.penalty.length > 0 && (
        <div className="h-30 bg-red-500">
          <p className="text-white text-center font-semibold py-2 text-sm">
            Your account have an active penalty until{' '}
            {formatDateTime(userInfo.penalty[0].end_date)}
          </p>
        </div>
      )}
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
                        <div className="size-8 rounded-full bg-gray-400 flex justify-center items-center">
                          <span className="capitalize font-bold">
                            {auth.name[0]}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {userInfo.membership.length > 0 && (
                        <DropdownMenuItem className="hover:bg-white flex flex-col">
                          <Badge variant="outline">Membership</Badge>
                          <span className="text-xs">
                            Until :{' '}
                            {format(
                              userInfo.membership[0].end_date,
                              'dd MMM yyyy'
                            )}
                          </span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        Hi, {String(auth?.name)}
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
    </>
  );
};

export default UserNavbar;

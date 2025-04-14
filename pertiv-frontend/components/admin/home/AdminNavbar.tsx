'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteCookie } from '@/lib/actions/auth.action';
import { AuthUser } from '@/model/auth.model';
import Link from 'next/link';

interface Props {
  auth: AuthUser | null | undefined;
}

const AdminNavbar = ({ auth }: Props) => {
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
            <div className="flex items-center space-x-4 text-white tracking-wide">
              <Link href="/admin" className="text-lg font-bold tracking-wider">
                PERTIV
              </Link>
            </div>
            {auth && (
              <div className="flex gap-4 items-center text-white font-medium">
                <Link href="/admin/log">Logs</Link>
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
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;

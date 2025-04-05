'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '../ui/card';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const BookMode = () => {
  const search = useSearchParams();
  const modeParams = search.get('mode');
  const searchParams = search.get('search');
  const pathname = usePathname();
  const [mode, setMode] = useState('');

  const { replace } = useRouter();
  useEffect(() => {
    const setParams = () => {
      setMode(
        modeParams === 'bookBorrowing' ? 'Book borrowing' : 'Book selling'
      );
    };

    setParams();
  }, [modeParams]);

  const changeMode = (value: string, path: string) => {
    replace(
      !searchParams ? `?mode=${path}` : `?mode=${path}&search=${searchParams}`
    );
    setMode(value);
  };

  return (
    pathname !== '/staff' && (
      <Card className="py-1 px-2 rounded-sm ">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-xs w-24">
            {mode}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              className="text-xs cursor-pointer"
              onClick={() => changeMode('Book selling', 'bookSelling')}
            >
              Book selling
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs cursor-pointer"
              onClick={() => changeMode('Book borrowing', 'bookBorrowing')}
            >
              Book borrowing
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
    )
  );
};

export default BookMode;

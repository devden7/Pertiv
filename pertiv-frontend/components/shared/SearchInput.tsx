'use client';

import React, { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  placeholder: string;
  path: string;
}
const SearchInput = ({ placeholder, path }: Props) => {
  const [keyword, setKeyword] = useState('');
  const search = useSearchParams();
  const modeParams = search.get('mode');
  const { replace } = useRouter();

  useEffect(() => {
    const debounceTyping = setTimeout(() => {
      if (!keyword) {
        replace(path);
      } else {
        replace(
          !modeParams
            ? `?search=${keyword}`
            : `?mode=${modeParams}&search=${keyword}`
        );
      }
    }, 300);
    return () => clearTimeout(debounceTyping);
  }, [keyword]);
  return (
    <div className="max-sm:w-1/2 w-[30%] my-3">
      <Label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </Label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <Search size={15} />
        </div>
        <Input
          type="search"
          id="default-search"
          className=" w-full p-4 ps-10 text-sm  rounded-lg"
          placeholder={placeholder}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchInput;

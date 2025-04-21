'use client';

import { IBookForBorrowing, IBookForSelling } from '@/model/user.model';
import React, { useState } from 'react';
import DataNotFound from './DataNotFound';
import Link from 'next/link';
import Image from 'next/image';
import { ImageHandler } from '@/utils/imageHandler';
import { Badge } from '../ui/badge';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import CartBtn from './CartBtn';
import CartLoanBtn from './CartLoanBtn';
import { PaginationWithLinks } from '../ui/pagination-with-links';
import SearchInput from './SearchInput';

interface Props {
  titlePage: string;
  data: IBookForSelling[] | IBookForBorrowing[];
  type: string;
  detailUrl: string;
  token?: string;
  page: number;
  pageSize: number;
  totalCount: number;
}
const Books = ({
  titlePage,
  data,
  type,
  detailUrl,
  token,
  page,
  pageSize,
  totalCount,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <section>
      <div className="container">
        <h1 className="font-semibold mb-2 text-xl">{titlePage}</h1>
        <SearchInput
          placeholder="Search by Book Title"
          path={
            type === '/books-selling' ? '/books-selling' : '/books-borrowing'
          }
        />
        {data.length === 0 && <DataNotFound data={data} />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {data.map((book) => (
            <div key={book.id}>
              <Link href={`${detailUrl}/${book.id}`}>
                <div className="relative w-9/12 aspect-[2/3] mx-auto overflow-hidden">
                  <Image
                    src={ImageHandler(book.imageUrl)}
                    alt={book.title}
                    fill
                    sizes="50vw"
                    quality={100}
                    className="object-cover p-2"
                  />
                </div>
                <div className="mt-3">
                  <div className="mt-2 flex gap-2">
                    {book.category.map((cat) => (
                      <Badge
                        variant="outline"
                        key={cat.categories.name}
                        className="capitalize"
                      >
                        {cat.categories.name}
                      </Badge>
                    ))}
                  </div>
                  <div
                    className={`${
                      type === '/books-selling' ? 'flex justify-between' : ''
                    }`}
                  >
                    <p
                      className={`font-semibold text-lg break-words min-w-0 ${
                        type === '/books-selling' ? 'max-w-[65%]' : ''
                      } h-14 overflow-hidden capitalize`}
                    >
                      {book.title}
                    </p>
                    {'price' in book && (
                      <h6 className="font-semibold text-lg leading-8 text-primary-600">
                        RP {formatNumberToRupiah(book.price)}
                      </h6>
                    )}
                  </div>
                </div>
              </Link>
              <div className="flex justify-between items-center mt-3">
                {type === '/books-selling' && (
                  <CartBtn
                    id={book.id}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    type="btn"
                    token={token}
                  />
                )}

                {type === '/books-borrowing' && (
                  <CartLoanBtn
                    id={book.id}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    type="btn"
                    token={token}
                  />
                )}
                {'price' in book && book.totalItemSold > 0 && (
                  <p className="text-xs text-gray-500">
                    {book.totalItemSold} Item sold
                  </p>
                )}
                {'totalItemBorrow' in book && book.totalItemBorrow > 0 && (
                  <p className="text-xs text-gray-500">
                    {book.totalItemBorrow} Item sold
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {totalCount > 0 && (
          <div className="my-3">
            <PaginationWithLinks
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Books;

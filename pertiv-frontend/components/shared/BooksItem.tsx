import { ImageHandler } from '@/utils/imageHandler';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import CartBtn from './CartBtn';
import { bookItemBorrowing, bookItemSelling } from '@/model/user.model';
import CartLoanBtn from './CartLoanBtn';

interface Props {
  token?: string;
  detailUrl: string;
  book: bookItemSelling | bookItemBorrowing;
  type: string;
}
const BooksItem = ({ token, book, detailUrl, type }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
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
              <Badge variant="outline" key={cat.categories.name}>
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
              } h-14 overflow-hidden`}
            >
              {book.title}
            </p>
            {'price' in book && (
              <h6 className="font-semibold text-lg leading-8 text-primary-600">
                {formatNumberToRupiah(book.price)}
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
  );
};

export default BooksItem;

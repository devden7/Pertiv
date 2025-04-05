'use client';

import { ImageHandler } from '@/utils/imageHandler';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import CartBtn from './CartBtn';
import { bookItemBorrowing, bookItemSelling } from '@/model/user.model';

interface Props {
  token?: string;
  detailUrl: string;
  book: bookItemSelling | bookItemBorrowing;
}
const BooksItem = ({ token, book, detailUrl }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      <Link href={`${detailUrl}/${book.id}`}>
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
          <Image
            src={ImageHandler(book.imageUrl)}
            alt="face cream image"
            fill
            objectFit="cover"
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
          <div className="flex items-center justify-between">
            <p className="font-semibold text-xl leading-8 text-black transition-all duration-500">
              {book.title}
            </p>
            {'price' in book && (
              <h6 className="font-semibold text-xl leading-8 text-primary-600">
                {formatNumberToRupiah(book.price)}
              </h6>
            )}
          </div>
        </div>
      </Link>
      <div className="flex justify-between items-center mt-3">
        <CartBtn
          id={book.id}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          type="btn"
          token={token}
        />
        {'price' in book && (
          <p className="text-xs text-gray-500">
            {book.totalItemSold} Item sold
          </p>
        )}
      </div>
    </div>
  );
};

export default BooksItem;

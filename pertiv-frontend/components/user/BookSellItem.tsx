'use client';

import Image from 'next/image';

import { ImageHandler } from '@/utils/imageHandler';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import CartBtn from './CartBtn';
import { useState } from 'react';

interface Props {
  id: string;
  token?: string;
  title: string;
  imageUrl: string | null;
  price: number;
  category: { categories: { name: string } }[];
  totalItemSold: number;
}
const BookSellItem = ({
  id,
  token,
  title,
  imageUrl,
  price,
  category,
  totalItemSold,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      <Link href={`/book-selling/${id}`}>
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
          <Image
            src={ImageHandler(imageUrl)}
            alt="face cream image"
            fill
            objectFit="cover"
          />
        </div>
        <div className="mt-3">
          <div className="mt-2 flex gap-2">
            {category.map((cat) => (
              <Badge variant="outline" key={cat.categories.name}>
                {cat.categories.name}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-xl leading-8 text-black transition-all duration-500">
              {title}
            </p>
            <h6 className="font-semibold text-xl leading-8 text-primary-600">
              {formatNumberToRupiah(price)}
            </h6>
          </div>
        </div>
      </Link>
      <div className="flex justify-between items-center mt-3">
        <CartBtn
          id={id}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          type="btn"
          token={token}
        />
        <p className="text-xs text-gray-500">{totalItemSold} Item sold</p>
      </div>
    </div>
  );
};

export default BookSellItem;

'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ImageHandler } from '@/utils/imageHandler';
import { createOrder } from '@/lib/actions/user.action';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import CartBtn from './CartBtn';

interface Props {
  id: string;
  title: string;
  description: string;
  stock: number;
  language: string;
  imageUrl: string | null;
  publisherName: string;
  writerName: string;
  category: { categories: { name: string } }[];
  token?: string;
}

const BookSellingDetailInformation = ({
  id,
  title,
  description,
  stock,
  language,
  imageUrl,
  publisherName,
  writerName,
  category,
  token,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const orderHandler = async () => {
    setIsLoading(true);
    const cartItem = [];

    cartItem.push({ book_id: id, quantity: 1 });

    const response = await createOrder(cartItem, token);

    if (!response || !response.success) {
      toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
        duration: 2000,
      });

      setIsLoading(false);
      return;
    }

    const splitOrderId = response.data.id.split('#');

    router.push(`/payment/${splitOrderId[1]}`);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <>
      <section className="p-3">
        <div className="container">
          <div className="flex flex-wrap gap-5 justify-center">
            <div className="relative rounded-md overflow-hidden w-44 h-64 md:w-64 md:h-72">
              <Image
                src={ImageHandler(imageUrl)}
                alt={title}
                fill
                objectFit="cover"
              />
            </div>
            <div className="w-full md:w-1/3">
              <div className="mt-2 flex gap-2">
                {category.map((cat) => (
                  <Badge variant="outline" key={cat.categories.name}>
                    {cat.categories.name}
                  </Badge>
                ))}
              </div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <div className="text-sm">
                <div className="flex justify-between">
                  <p className="text-slate-500">Stock</p>
                  <p className="font-medium">{stock}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-slate-500">Publisher </p>
                  <p className="font-medium">{publisherName}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-slate-500">Writer </p>
                  <p className="font-medium">{writerName}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-slate-500">Language </p>
                  <p className="font-medium">{language}</p>
                </div>

                <div className="flex gap-2 justify-center mt-3">
                  <Button
                    className="bg-primary-500 hover:bg-primary-600"
                    onClick={() => orderHandler()}
                    disabled={isLoading}
                  >
                    Order
                  </Button>
                  <CartBtn
                    id={id}
                    token={token}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div>
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookSellingDetailInformation;

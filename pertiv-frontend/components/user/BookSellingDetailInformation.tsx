'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ImageHandler } from '@/utils/imageHandler';
import { addBookToCart } from '@/lib/actions/user.action';
import { useToast } from '@/hooks/use-toast';

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
  const addToCartHandler = async (bookId: string) => {
    setIsLoading(true);
    const response = await addBookToCart(bookId, token);

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

    toast({
      description: response.message,
      duration: 2000,
    });
    setIsLoading(false);
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
                  <Button className="bg-primary-600">Order</Button>
                  <Button
                    variant="outline"
                    className="text-primary-500"
                    onClick={() => addToCartHandler(id)}
                    disabled={isLoading}
                  >
                    Add to Cart
                  </Button>
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

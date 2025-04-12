'use client';

import { ImageHandler } from '@/utils/imageHandler';
import Image from 'next/image';
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import CartBtn from './CartBtn';
import { useToast } from '@/hooks/use-toast';
import { borrowingBook, createOrder } from '@/lib/actions/user.action';
import { useRouter } from 'next/navigation';
import CartLoanBtn from './CartLoanBtn';

type bookSellingDetail = {
  id: string;
  title: string;
  description: string;
  stock: number;
  language: string;
  imageUrl: string | null;
  publisherName: string;
  writerName: string;
  category: { categories: { name: string } }[];
  user: {
    name: string;
  };
};
type bookBorrowingDetail = {
  id: string;
  title: string;
  description: string;
  book_position: string;
  stock: number;
  language: string;
  imageUrl: string | null;
  publisherName: string;
  writerName: string;
  category: { categories: { name: string } }[];
  user: {
    name: string;
  };
};

interface Props {
  type: string;
  book: bookSellingDetail | bookBorrowingDetail;
  token?: string;
}
const BookDetail = ({ type, book, token }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const orderHandler = async (typeTransction: string) => {
    setIsLoading(true);
    const cartItem = [];

    if (typeTransction === 'buy') {
      cartItem.push({ book_id: book.id, quantity: 1 });
    } else {
      cartItem.push({ book_id: book.id });
    }

    const response =
      typeTransction === 'buy'
        ? await createOrder(cartItem, token)
        : await borrowingBook(cartItem, token);

    if (!response) {
      toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
        duration: 2000,
      });

      setIsLoading(false);
      return;
    }

    if (!response.success && response.statusCode !== 201) {
      toast({
        variant: 'destructive',
        title: response.message,
        duration: 2000,
      });

      setIsLoading(false);
      return;
    }

    if (typeTransction === 'buy') {
      const splitOrderId = response.data.id.split('#');
      router.push(`/payment/${splitOrderId[1]}`);
    } else {
      router.push('/transactions?mode=bookBorrowing');
    }

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
                src={ImageHandler(book.imageUrl)}
                alt={book.title}
                fill
                objectFit="cover"
              />
            </div>

            <div className="w-full md:w-1/3">
              <div className="mt-2 flex justify-between">
                <div className="flex gap-2">
                  {book.category.map((cat) => (
                    <Badge variant="outline" key={cat.categories.name}>
                      {' '}
                      {cat.categories.name}
                    </Badge>
                  ))}
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    Product added by{' '}
                    {book.user !== null ? book.user.name : 'staff'}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <div className="text-sm">
                <div className="flex justify-between">
                  <p className="text-slate-500">Stock</p>
                  <p className="font-medium">{book.stock}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-slate-500">Publisher </p>
                  <p className="font-medium">{book.publisherName}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-slate-500">Writer </p>
                  <p className="font-medium">{book.writerName}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-slate-500">Language </p>
                  <p className="font-medium">{book.language}</p>
                </div>
                {type === 'Borrowing' && (
                  <div className="flex justify-between">
                    <p className="text-slate-500">Book position </p>
                    <p className="font-medium">
                      {(book as bookBorrowingDetail).book_position}
                    </p>
                  </div>
                )}
                {book.stock === 0 && (
                  <div className="flex  justify-center mt-3">
                    <Button variant="outline" className="cursor-default">
                      No stock
                    </Button>
                  </div>
                )}
                {book.stock > 0 && type !== 'Borrowing' && (
                  <div className="flex gap-2 justify-center mt-3">
                    <Button
                      className="bg-primary-500 hover:bg-primary-600"
                      onClick={() => orderHandler('buy')}
                      disabled={isLoading}
                    >
                      Order
                    </Button>
                    <CartBtn
                      id={book.id}
                      token={token}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      type="text"
                    />
                  </div>
                )}
                {book.stock > 0 && type === 'Borrowing' && (
                  <div className="flex gap-2 justify-center mt-3">
                    <Button
                      className="bg-primary-500 hover:bg-primary-600"
                      onClick={() => orderHandler('borrow')}
                      disabled={isLoading}
                    >
                      Borrow
                    </Button>
                    <CartLoanBtn
                      id={book.id}
                      token={token}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      type="text"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div>
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-sm text-slate-500">{book.description}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookDetail;

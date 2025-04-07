'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { removeBookFromLoanCart } from '@/lib/actions/user.action';
import { ILoanCartDetail } from '@/model/user.model';
import { ImageHandler } from '@/utils/imageHandler';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface Props extends ILoanCartDetail {
  token?: string;
}

const LoanCartItem = ({ id, title, description, imageUrl, token }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const removeItemLoanCartHandler = async (bookId: string) => {
    setIsLoading(true);
    const response = await removeBookFromLoanCart(bookId, token);

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

    toast({
      description: response.message,
      duration: 2000,
    });

    setIsLoading(false);
  };
  return (
    <div className="mb-4 flex justify-between items-center border-b-[1.5px] border-gray-200">
      <div className="flex gap-2 items-center">
        <div className="relative mb-4 size-24 overflow-hidden rounded-xl">
          <Image
            className="object-cover"
            src={ImageHandler(imageUrl)}
            alt="book"
            fill
            sizes="50vw"
            quality={90}
          />
        </div>
        <div>
          <h1 className="font-semibold">{title}</h1>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div>
        <Button
          variant="outline"
          className="text-primary-500 hover:text-primary-600"
          onClick={() => removeItemLoanCartHandler(id)}
          disabled={isLoading}
        >
          <Trash />
          Remove
        </Button>
      </div>
    </div>
  );
};

export default LoanCartItem;

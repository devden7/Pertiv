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

const LoanCartItem = ({ id, title, imageUrl, token }: Props) => {
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
    <div className="mb-4 flex max-sm:flex-col justify-between items-center border-b-[1.5px] border-gray-200">
      <div className="flex gap-2 items-center max-sm:flex-col max-sm:gap-4">
        <div className="relative w-24 aspect-[2/3] overflow-hidden">
          <Image
            className="object-cover p-2"
            src={ImageHandler(imageUrl)}
            alt={title}
            fill
            sizes="50vw"
            quality={100}
          />
        </div>
        <div>
          <h1 className="font-semibold max-w-96 max-md:w-52 break_text">
            {title}
          </h1>
        </div>
      </div>
      <div>
        <Button
          variant="outline"
          className="text-primary-500 hover:text-primary-600 mb-2"
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

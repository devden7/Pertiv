import Image from 'next/image';
import { Minus, Plus, Trash } from 'lucide-react';
import { ImageHandler } from '@/utils/imageHandler';
import { Button } from '../../ui/button';
import {
  addBookToCart,
  decreaseBookFromCart,
  removeBookFromCart,
} from '@/lib/actions/user.action';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import { ICartDetail } from '@/model/user.model';

interface Props extends ICartDetail {
  token?: string;
}
const CartItem = ({ id, quantity, title, imageUrl, price, token }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const removeItemCartHandler = async (bookId: string, type: string) => {
    setIsLoading(true);
    const response =
      type === 'remove'
        ? await removeBookFromCart(bookId, token)
        : await decreaseBookFromCart(bookId, token);

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

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

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

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="mb-4 flex  max-sm:flex-col justify-between items-center border-b-[1.5px] border-gray-200">
      <div className="flex gap-2 items-center max-sm:flex-col max-sm:gap-4">
        <div className="relative w-24 aspect-[2/3] overflow-hidden">
          <Image
            className="object-cover p-2"
            src={ImageHandler(imageUrl)}
            alt="book"
            fill
            sizes="50vw"
            quality={100}
          />
        </div>
        <div className="max-sm:flex max-sm:items-center max-sm:flex-col">
          <h1 className="font-semibold max-w-96 max-md:w-52 break_text">
            {title}
          </h1>
          <p className="text-xs text-gray-800 mt-5 mb-2">
            <span className="text-primary-500 font-medium">Qty {quantity}</span>{' '}
            X {formatNumberToRupiah(price)}
          </p>
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-3 flex justify-between gap-2">
          <Button
            variant="outline"
            className="text-primary-500 size-6 hover:text-primary-600"
            disabled={isLoading}
            onClick={() => removeItemCartHandler(id, 'decrease')}
          >
            <Minus />
          </Button>
          <div>
            <span>{quantity}</span>
          </div>
          <Button
            variant="outline"
            className="text-primary-500 size-6 hover:text-primary-600"
            disabled={isLoading}
            onClick={() => addToCartHandler(id)}
          >
            <Plus />
          </Button>
        </div>
        <Button
          variant="outline"
          className="text-primary-500 hover:text-primary-600 mb-3"
          onClick={() => removeItemCartHandler(id, 'remove')}
          disabled={isLoading}
        >
          <Trash />
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;

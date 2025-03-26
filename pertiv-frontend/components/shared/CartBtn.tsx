import React from 'react';
import { Button } from '../ui/button';
import { addBookToCart } from '@/lib/actions/user.action';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

interface Props {
  id: string;
  isLoading: boolean;
  token?: string;
  type: string;
  setIsLoading: (value: boolean) => void;
}
const CartBtn = ({ id, token, type, isLoading, setIsLoading }: Props) => {
  const { toast } = useToast();

  const addToCartHandler = async (bookId: string) => {
    if (!token) {
      return toast({
        description: 'Please login Before adding item to cart',
        duration: 2000,
      });
    }
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
    <Button
      variant="outline"
      className="text-primary-500"
      onClick={() => addToCartHandler(id)}
      disabled={isLoading}
    >
      {type === 'btn' ? <ShoppingCart /> : 'Add to cart'}
    </Button>
  );
};

export default CartBtn;

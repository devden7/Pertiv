import { useToast } from '@/hooks/use-toast';
import { addBookToLoanCart } from '@/lib/actions/user.action';
import React from 'react';
import { Button } from '../ui/button';
import { BookMarked } from 'lucide-react';

interface Props {
  id: string;
  isLoading: boolean;
  token?: string;
  type: string;
  setIsLoading: (value: boolean) => void;
}

const CartLoanBtn = ({ id, token, type, isLoading, setIsLoading }: Props) => {
  const { toast } = useToast();

  const addToLoanCartHandler = async (bookId: string) => {
    if (!token) {
      return toast({
        description: 'Please login Before adding item to cart',
        duration: 2000,
      });
    }
    setIsLoading(true);
    const response = await addBookToLoanCart(bookId, token);

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
    <Button
      variant="outline"
      className="text-primary-500"
      onClick={() => addToLoanCartHandler(id)}
      disabled={isLoading}
    >
      {type === 'btn' ? <BookMarked /> : 'Add to loan cart'}
    </Button>
  );
};

export default CartLoanBtn;

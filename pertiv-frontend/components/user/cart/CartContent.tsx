'use client';

import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { calcTotalPrice } from '@/utils/calcTotalPrice';
import { Button } from '../../ui/button';
import { createOrder } from '@/lib/actions/user.action';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import CartList from './CartList';
import { ICartList } from '@/model/user.model';
import DataNotFound from '@/components/shared/DataNotFound';

interface Props {
  data: ICartList;
  token?: string;
}

const CartContent = ({ data, token }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const orderHandler = async () => {
    setIsLoading(true);
    const cartItem = data.cart_items.map((item) => {
      return {
        book_id: item.id,
        quantity: item.quantity,
      };
    });

    const response = await createOrder(cartItem, token);

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

    const splitOrderId = response.data.id.split('#');

    router.push(`/payment/${splitOrderId[1]}`);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <section>
      <div className="container">
        <div className="flex justify-center items-center my-2">
          <Card className="w-1/2 p-2 max-sm:w-full">
            <h1 className="text-xl font-medium text-center">Books Cart</h1>
            <CartList data={data} token={token} />
            {data.cart_items.length === 0 && (
              <DataNotFound data={data.cart_items} />
            )}
            {data.cart_items.length > 0 && (
              <div className="flex justify-between">
                <div className="font-medium">Total</div>
                <div className="font-medium">
                  {formatNumberToRupiah(calcTotalPrice(data.cart_items))}
                </div>
              </div>
            )}
            {data.cart_items.length > 0 && (
              <div className="mt-3 flex justify-center">
                <Button
                  className="bg-primary-500 hover:bg-primary-600"
                  disabled={isLoading}
                  onClick={() => orderHandler()}
                >
                  Order Now
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CartContent;

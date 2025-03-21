import React from 'react';
import { Card } from '../ui/card';
import CartItem from './CartItem';
import { calcTotalPrice } from '@/utils/calcTotalPrice';

interface Props {
  data: {
    cart_items: {
      id: string;
      quantity: number;
      title: string;
      description: string;
      imageUrl: string | null;
      price: number;
    }[];
  };
  token?: string;
}

const CartContent = ({ data, token }: Props) => {
  return (
    <section>
      <div className="container">
        <div className="flex justify-center items-center my-2">
          <Card className="w-1/2 p-2">
            <h1 className="text-xl font-medium text-center">Books Cart</h1>
            <div>
              {data.cart_items.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  quantity={item.quantity}
                  title={item.title}
                  description={item.description}
                  imageUrl={item.imageUrl}
                  price={item.price}
                  token={token}
                />
              ))}
            </div>
            <div className="flex justify-between">
              <div className="font-medium">Total</div>
              <div className="font-medium">
                {calcTotalPrice(data.cart_items)}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CartContent;

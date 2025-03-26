import React from 'react';
import CartItem from './CartItem';
import { ICartList } from '@/model/user.model';

interface Props {
  data: ICartList;
  token?: string;
}
const CartList = ({ data, token }: Props) => {
  return (
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
  );
};

export default CartList;

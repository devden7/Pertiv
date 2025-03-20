import CartContent from '@/components/user/CartContent';
import { getBookCart } from '@/lib/actions/user.action';
import React from 'react';

const CartPage = async () => {
  const data = await getBookCart();

  return (
    <>
      <CartContent data={data.data} />
    </>
  );
};

export default CartPage;

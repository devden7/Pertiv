import CartContent from '@/components/user/CartContent';
import { getUserToken } from '@/lib/actions/auth.action';
import { getBookCart } from '@/lib/actions/user.action';
import React from 'react';

const CartPage = async () => {
  const user = await getUserToken();
  if (!user) {
    return;
  }
  const data = await getBookCart(user.token);
  return (
    <>
      <CartContent data={data.data} token={user.token} />
    </>
  );
};

export default CartPage;

import LoanCartContent from '@/components/user/loanCart/LoanCartContent';
import { getUserToken } from '@/lib/actions/auth.action';
import { getBookLoanCart } from '@/lib/actions/user.action';
import React from 'react';

const LoanCart = async () => {
  const user = await getUserToken();
  if (!user) {
    return;
  }
  const data = await getBookLoanCart(user.token);

  return <LoanCartContent data={data.data} token={user.token} />;
};

export default LoanCart;

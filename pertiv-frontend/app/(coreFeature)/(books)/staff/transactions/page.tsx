import TransactionContent from '@/components/books/staff/transactions/TransactionContent';
import { getUserToken } from '@/lib/actions/auth.action';
import { getTransactions } from '@/lib/actions/staff.action';
import React from 'react';

const Transaction = async () => {
  const user = await getUserToken();
  if (!user) {
    return;
  }
  const data = await getTransactions(user.token);
  return (
    <>
      <TransactionContent data={data.data} />
    </>
  );
};

export default Transaction;

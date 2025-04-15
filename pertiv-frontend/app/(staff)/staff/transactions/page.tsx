import TransactionContent from '@/components/staff/transactions/TransactionContent';
import { getUserToken } from '@/lib/actions/auth.action';
import {
  getBorrowTransactions,
  getTransactions,
} from '@/lib/actions/staff.action';
import React from 'react';

interface ParamsProps {
  searchParams: { [key: string]: string };
}
const Transaction = async ({ searchParams }: ParamsProps) => {
  const user = await getUserToken();
  if (!user) {
    return;
  }
  const page = parseInt(searchParams.page) || 1;
  const search = searchParams.search || '';
  const modeBook = searchParams.mode || '';
  const SIZE = 10;
  const data =
    modeBook === 'bookBorrowing'
      ? await getBorrowTransactions(page, search, user.token)
      : await getTransactions(page, search, user.token);
  return (
    <>
      <TransactionContent
        data={data.data}
        token={user.token}
        page={page}
        pageSize={SIZE}
        totalCount={data.totalCount}
        mode={modeBook}
        key={modeBook}
      />
    </>
  );
};

export default Transaction;

import TransactionContent from '@/components/user/transactionContent/TransactionContent';
import { getUserToken } from '@/lib/actions/auth.action';
import { getTransactions } from '@/lib/actions/user.action';
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
  const SIZE = 10;
  const data = await getTransactions(page, search, user.token);
  return (
    <>
      <TransactionContent
        data={data.data}
        page={page}
        pageSize={SIZE}
        totalCount={data.totalCount}
      />
    </>
  );
};

export default Transaction;

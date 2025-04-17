'use client';

import React, { useEffect, useState } from 'react';

import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { IBorrowTransaction, ITransaction } from '@/model/user.model';
import TransactionList from './TransactionList';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import SearchInput from '@/components/shared/SearchInput';
import BookMode from '@/components/shared/BookMode';
import DataNotFound from '@/components/shared/DataNotFound';
import { supabase } from '@/lib/actions/supabase';

interface Props {
  data: ITransaction[] | IBorrowTransaction[];
  page: number;
  pageSize: number;
  totalCount: number;
  mode: string;
  token?: string;
}
const TransactionContent = ({
  data,
  page,
  pageSize,
  totalCount,
  mode,
  token,
}: Props) => {
  const [transactionsData, setTransactionData] =
    useState<(ITransaction | IBorrowTransaction)[]>(data);

  useEffect(() => {
    setTransactionData(data);
  }, [data]);

  useEffect(() => {
    const tableName = mode !== 'bookBorrowing' ? 'Order' : 'BookBorrowed';

    const channel = supabase
      .channel(`List books  ${tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
        },
        async (payload) => {
          if (payload.eventType === 'UPDATE') {
            if (payload.new.status === 'success' && mode !== 'bookBorrowing') {
              setTransactionData((prev) => {
                const arr = [...prev];
                const findData = arr.find((item) => item.id === payload.new.id);

                const findIndex = arr.findIndex(
                  (item) => item.id === payload.new.id
                );
                if (findIndex !== -1) {
                  arr[findIndex] = {
                    ...(findData as ITransaction),
                    buy_date: payload.new.buy_date,
                    buy_handled_by: payload.new.buy_handled_by,
                    status: payload.new.status,
                  };
                }
                return arr;
              });
            } else if (payload.new.status === 'canceled') {
              setTransactionData((prev) => {
                const arr = [...prev];
                const findData = arr.find((item) => item.id === payload.new.id);
                const findIndex = arr.findIndex(
                  (item) => item.id === payload.new.id
                );
                if (findIndex !== -1) {
                  arr[findIndex] = {
                    ...(findData as IBorrowTransaction),
                    canceled_at: payload.new.canceled_at,
                    status: payload.new.status,
                  };
                }
                return arr;
              });
            } else if (
              payload.new.status === 'accepted' &&
              mode === 'bookBorrowing'
            ) {
              setTransactionData((prev) => {
                const arr = [...prev];
                const findData = arr.find((item) => item.id === payload.new.id);
                const findIndex = arr.findIndex(
                  (item) => item.id === payload.new.id
                );
                if (findIndex !== -1) {
                  arr[findIndex] = {
                    ...(findData as IBorrowTransaction),
                    status: payload.new.status,
                    loan_key: payload.new.loan_key,
                  };
                }
                return arr;
              });
            } else if (
              payload.new.status === 'borrowed' &&
              mode === 'bookBorrowing'
            ) {
              setTransactionData((prev) => {
                const arr = [...prev];
                const findData = arr.find((item) => item.id === payload.new.id);
                const findIndex = arr.findIndex(
                  (item) => item.id === payload.new.id
                );
                if (findIndex !== -1) {
                  arr[findIndex] = {
                    ...(findData as IBorrowTransaction),
                    loan_date: payload.new.loan_date,
                    ended_at: payload.new.ended_at,
                    status: payload.new.status,
                  };
                }
                return arr;
              });
            } else if (
              payload.new.status === 'returned' &&
              mode === 'bookBorrowing'
            ) {
              setTransactionData((prev) => {
                const arr = [...prev];
                const findData = arr.find((item) => item.id === payload.new.id);
                const findIndex = arr.findIndex(
                  (item) => item.id === payload.new.id
                );
                if (findIndex !== -1) {
                  arr[findIndex] = {
                    ...(findData as IBorrowTransaction),
                    date_returned: payload.new.date_returned,
                    status: payload.new.status,
                  };
                }
                return arr;
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mode]);

  return (
    <>
      <section>
        <div className="container">
          <div className="flex justify-between items-center my-2">
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              My Transactions
            </h2>
            <BookMode />
          </div>
          <SearchInput
            placeholder="Search by Order ID or Book"
            path={
              mode && (mode === 'bookBorrowing' || mode === 'bookSelling')
                ? `/transactions?mode=${mode}`
                : '/transactions'
            }
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ORDER ID</TableHead>
                {mode !== 'bookBorrowing' && (
                  <TableHead className="max-w-[150px] text-center">
                    BUYING DATE
                  </TableHead>
                )}
                {mode === 'bookBorrowing' && (
                  <TableHead className="max-w-[150px] text-center">
                    LOAN DATE
                  </TableHead>
                )}
                {mode !== 'bookBorrowing' && (
                  <TableHead className="text-center">TOTAL PRICE</TableHead>
                )}
                <TableHead className="text-center">STATUS</TableHead>
                <TableHead className="text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TransactionList
              data={transactionsData as IBorrowTransaction[] | ITransaction[]}
              mode={mode}
              token={token}
            />
          </Table>
          {transactionsData.length === 0 && (
            <DataNotFound data={transactionsData} />
          )}
        </div>
      </section>
      {totalCount > 0 && (
        <div className="my-3">
          <PaginationWithLinks
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
          />
        </div>
      )}
    </>
  );
};

export default TransactionContent;

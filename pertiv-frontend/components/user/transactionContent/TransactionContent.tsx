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
            setTransactionData((prev) => {
              const arr = [...prev];
              const findData = arr.find((item) => item.id === payload.new.id);

              const findIndex = arr.findIndex(
                (item) => item.id === payload.new.id
              );
              if (findIndex !== -1) {
                arr[findIndex] = {
                  ...(findData as ITransaction | IBorrowTransaction),
                  ...(mode !== 'bookBorrowing' && {
                    buy_date: payload.new.buy_date,
                  }),
                  ...(mode !== 'bookBorrowing' && {
                    buy_handled_by: payload.new.buy_handled_by,
                  }),
                  ...(mode !== 'bookBorrowing' && {
                    status: payload.new.status,
                  }),
                };
              }
              return arr;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mode, setTransactionData]);

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
              data={
                mode === 'bookBorrowing'
                  ? (data as IBorrowTransaction[])
                  : (transactionsData as ITransaction[])
              }
              mode={mode}
              token={token}
            />
          </Table>
          {transactionsData.length === 0 && (
            <DataNotFound
              data={mode === 'bookBorrowing' ? data : transactionsData}
            />
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

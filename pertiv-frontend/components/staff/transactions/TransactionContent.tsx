'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { ISBorrowTransaction, ISTransaction } from '@/model/staff.model';
import TransactionList from './TransactionList';
import FormConfirmBook from './FormConfirmBook';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import SearchInput from '@/components/shared/SearchInput';
import DataNotFound from '@/components/shared/DataNotFound';
import { supabase } from '@/lib/actions/supabase';
import {
  getTransactionBorrowingDetail,
  getTransactionDetail,
} from '@/lib/actions/staff.action';

interface Props {
  data: ISTransaction[] | ISBorrowTransaction[];
  page: number;
  pageSize: number;
  totalCount: number;
  token?: string;
  mode: string;
}

const TransactionContent = ({
  data,
  token,
  page,
  pageSize,
  totalCount,
  mode,
}: Props) => {
  const [transactionsData, setTransactionData] =
    useState<(ISTransaction | ISBorrowTransaction)[]>(data);

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
          if (payload.eventType === 'INSERT') {
            const newData =
              mode !== 'bookBorrowing'
                ? await getTransactionDetail(
                    payload.new.id.split('#')[1],
                    token
                  )
                : await getTransactionBorrowingDetail(
                    payload.new.id.split('#')[1],
                    token
                  );
            return setTransactionData((prev) => [newData.data, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            if (payload.new.status === 'canceled') {
              setTransactionData((prev) => {
                const arr = [...prev];
                const findData = arr.find((item) => item.id === payload.new.id);
                const findIndex = arr.findIndex(
                  (item) => item.id === payload.new.id
                );
                if (findIndex !== -1) {
                  arr[findIndex] = {
                    ...(findData as ISTransaction | ISBorrowTransaction),
                    canceled_at: payload.new.canceled_at,
                    status: payload.new.status,
                  };
                }
                return arr;
              });
            } else if (
              payload.new.status === 'paid' &&
              mode !== 'bookBorrowing'
            ) {
              setTransactionData((prev) => {
                const arr = [...prev];
                const findData = arr.find((item) => item.id === payload.new.id);
                const findIndex = arr.findIndex(
                  (item) => item.id === payload.new.id
                );
                if (findIndex !== -1) {
                  arr[findIndex] = {
                    ...(findData as ISTransaction),
                    paid_at: payload.new.paid_at,
                    status: payload.new.status,
                  };
                }
                return arr;
              });
            } else if (
              payload.new.status === 'return req' &&
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
                    ...(findData as ISBorrowTransaction),
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl my-2">
              Manage Transactions
            </h2>
            <p className=" text-slate-500 mb-3">Manage all transaction books</p>
          </div>
          <FormConfirmBook token={token} />
        </div>
        <SearchInput
          placeholder="Search by Order ID, Customer name, or Book"
          path={
            mode && (mode === 'bookBorrowing' || mode === 'bookSelling')
              ? `/staff/transactions?mode=${mode}`
              : '/staff/transactions'
          }
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">ORDER ID</TableHead>
              <TableHead className="text-center">CUSTOMER NAME</TableHead>
              <TableHead className="text-center">EMAIL</TableHead>

              <TableHead className="max-w-[150px] text-center">
                {mode !== 'bookBorrowing' ? 'BUYING DATE' : 'LOAN DATE'}
              </TableHead>
              {mode !== 'bookBorrowing' && (
                <TableHead className="text-center">TOTAL PRICE</TableHead>
              )}
              <TableHead className="text-center">
                {mode !== 'bookBorrowing' ? 'HANDLE BY' : 'LOAN HANDLE BY'}
              </TableHead>
              {mode === 'bookBorrowing' && (
                <TableHead className="text-center">RETURN HANDLE BY</TableHead>
              )}
              <TableHead className="text-center">STATUS</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TransactionList
            data={transactionsData as ISTransaction[] | ISBorrowTransaction[]}
            mode={mode}
            token={token}
          />
        </Table>
        {transactionsData.length === 0 && (
          <DataNotFound data={transactionsData} />
        )}
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

import React from 'react';

import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { IBorrowTransaction, ITransaction } from '@/model/user.model';
import TransactionList from './TransactionList';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import SearchInput from '@/components/shared/SearchInput';
import BookMode from '@/components/shared/BookMode';

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
            placeholder="Search by ORDER ID"
            path={
              mode && (mode === 'bookBorrowing' || mode === 'bookSelling')
                ? `/transactions?mode=${mode}`
                : '/transactions'
            }
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ORDER ID</TableHead>
                {mode !== 'bookBorrowing' && (
                  <TableHead className="max-w-[150px]">BUYING DATE</TableHead>
                )}
                {mode === 'bookBorrowing' && (
                  <TableHead className="max-w-[150px]">LOAN DATE</TableHead>
                )}
                {mode !== 'bookBorrowing' && <TableHead>TOTAL PRICE</TableHead>}
                <TableHead>STATUS</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TransactionList data={data} mode={mode} token={token} />
          </Table>
          {data.length < 1 && <p className="text-center">List not found</p>}
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

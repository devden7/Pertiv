import React from 'react';
import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { ISBorrowTransaction, ISTransaction } from '@/model/staff.model';
import TransactionList from './TransactionList';
import FormConfirmBook from './FormConfirmBook';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import SearchInput from '@/components/shared/SearchInput';

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
          placeholder="Search by Order ID or Name"
          path={
            mode && (mode === 'bookBorrowing' || mode === 'bookSelling')
              ? `/staff/transactions?mode=${mode}`
              : '/staff/transactions'
          }
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ORDER ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>

              <TableHead className="max-w-[150px]">
                {mode !== 'bookBorrowing' ? 'BUYING DATE' : 'LOAN DATE'}
              </TableHead>
              {mode !== 'bookBorrowing' && <TableHead>TOTAL PRICE</TableHead>}
              <TableHead>
                {mode !== 'bookBorrowing' ? 'HANDLE BY' : 'LOAN HANDLE BY'}
              </TableHead>
              {mode === 'bookBorrowing' && (
                <TableHead>RETURN HANDLE BY</TableHead>
              )}
              <TableHead>STATUS</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TransactionList data={data} mode={mode} token={token} />
        </Table>
        {data.length === 0 && <p>List not found</p>}
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

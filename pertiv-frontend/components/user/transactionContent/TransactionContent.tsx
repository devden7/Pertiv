import React from 'react';

import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { ITransaction } from '@/model/user.model';
import TransactionList from './TransactionList';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';

interface Props {
  data: ITransaction[];
  page: number;
  pageSize: number;
  totalCount: number;
}
const TransactionContent = ({ data, page, pageSize, totalCount }: Props) => {
  return (
    <>
      <section>
        <div className="container">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl my-2">
            My Transactions
          </h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ORDER ID</TableHead>
                <TableHead className="max-w-[150px]">BUYING DATE</TableHead>
                <TableHead>TOTAL PRICE</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TransactionList data={data} />
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

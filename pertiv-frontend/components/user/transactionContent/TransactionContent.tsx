import React from 'react';

import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { ITransaction } from '@/model/user.model';
import TransactionList from './TransactionList';

interface Props {
  data: ITransaction[];
}
const TransactionContent = ({ data }: Props) => {
  return (
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
      </div>
    </section>
  );
};

export default TransactionContent;

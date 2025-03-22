import React from 'react';
import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { ISTransaction } from '@/model/staff.model';
import TransactionList from './TransactionList';

interface Props {
  data: ISTransaction[];
}

const TransactionContent = ({ data }: Props) => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl my-2">
        Manage Transactions
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ORDER ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead className="max-w-[150px]">BUYING DATE</TableHead>
            <TableHead>TOTAL PRICE</TableHead>
            <TableHead>HANDLE BY</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TransactionList data={data} />
      </Table>
    </section>
  );
};

export default TransactionContent;

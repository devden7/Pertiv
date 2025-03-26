import React from 'react';
import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { ISTransaction } from '@/model/staff.model';
import TransactionList from './TransactionList';
import FormConfirmBook from './FormConfirmBook';

interface Props {
  data: ISTransaction[];
  token?: string;
}

const TransactionContent = ({ data, token }: Props) => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl my-2">
        Manage Transactions
      </h2>
      <p className=" text-slate-500 mb-3">Manage all transaction books</p>
      <FormConfirmBook token={token} />

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

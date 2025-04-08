import React from 'react';
import { TableBody } from '@/components/ui/table';
import { ISBorrowTransaction, ISTransaction } from '@/model/staff.model';
import TransactionItem from './TransactionItem';

interface Props {
  data: ISTransaction[] | ISBorrowTransaction[];
  mode: string;
}
const TransactionList = ({ data, mode }: Props) => {
  return (
    <TableBody>
      {data.map((item) => (
        <TransactionItem key={item.id} item={{ ...item }} mode={mode} />
      ))}
    </TableBody>
  );
};

export default TransactionList;

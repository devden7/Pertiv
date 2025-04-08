import { TableBody } from '@/components/ui/table';
import React from 'react';
import TransactionItem from './TransactionItem';
import { IBorrowTransaction, ITransaction } from '@/model/user.model';

interface Props {
  data: ITransaction[] | IBorrowTransaction[];
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

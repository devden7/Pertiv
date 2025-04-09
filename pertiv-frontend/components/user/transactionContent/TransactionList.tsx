import { TableBody } from '@/components/ui/table';
import React from 'react';
import TransactionItem from './TransactionItem';
import { IBorrowTransaction, ITransaction } from '@/model/user.model';

interface Props {
  data: ITransaction[] | IBorrowTransaction[];
  mode: string;
  token?: string;
}

const TransactionList = ({ data, mode, token }: Props) => {
  return (
    <TableBody>
      {data.map((item) => (
        <TransactionItem
          key={item.id}
          item={{ ...item }}
          mode={mode}
          token={token}
        />
      ))}
    </TableBody>
  );
};

export default TransactionList;

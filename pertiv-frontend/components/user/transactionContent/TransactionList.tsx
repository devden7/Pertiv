import { TableBody } from '@/components/ui/table';
import React from 'react';
import TransactionItem from './TransactionItem';
import { ITransaction } from '@/model/user.model';

interface Props {
  data: ITransaction[];
}

const TransactionList = ({ data }: Props) => {
  console.log(data);
  return (
    <TableBody>
      {data.map((item) => (
        <TransactionItem
          key={item.id}
          id={item.id}
          status={item.status}
          buy_key={item.buy_key}
          buy_handled_by={item.buy_handled_by}
          buy_date={item.buy_date}
          total_price={item.total_price}
          created_at={item.created_at}
          ended_at={item.ended_at}
          canceled_at={item.canceled_at}
          paid_at={item.paid_at}
          item_Order={item.item_Order}
        />
      ))}
    </TableBody>
  );
};

export default TransactionList;

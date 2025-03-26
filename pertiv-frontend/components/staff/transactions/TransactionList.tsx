import React from 'react';
import { TableBody } from '@/components/ui/table';
import { ISTransaction } from '@/model/staff.model';
import TransactionItem from './TransactionItem';

interface Props {
  data: ISTransaction[];
}
const TransactionList = ({ data }: Props) => {
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
          userId={item.userId}
          user={item.user}
          item_order={item.item_order}
        />
      ))}
    </TableBody>
  );
};

export default TransactionList;

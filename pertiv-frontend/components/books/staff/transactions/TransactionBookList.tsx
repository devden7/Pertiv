import React from 'react';
import { TableBody } from '@/components/ui/table';
import { ISItemOrder } from '@/model/staff.model';
import PaymentBookItem from '@/components/user/PaymentBookItem';

interface Props {
  item_order: ISItemOrder[];
}

const TransactionBookList = ({ item_order }: Props) => {
  return (
    <TableBody>
      {item_order.map((item) => (
        <PaymentBookItem
          key={item.id}
          book_title={item.book_title}
          book_imageUrl={item.book_imageUrl}
          book_price={item.book_price}
          quantity={item.quantity}
        />
      ))}
    </TableBody>
  );
};

export default TransactionBookList;

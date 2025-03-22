import React from 'react';
import { TableBody } from '@/components/ui/table';
import { IItemOrder } from '@/model/user.model';
import PaymentBookItem from '../PaymentBookItem';

interface Props {
  item_order: IItemOrder[];
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

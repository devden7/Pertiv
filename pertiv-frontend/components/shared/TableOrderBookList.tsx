import { ISItemOrder } from '@/model/staff.model';
import { IItemOrder } from '@/model/user.model';
import React from 'react';
import { TableBody } from '../ui/table';
import TableOrderBookItem from './TableOrderBookItem';

interface Props {
  item_order: IItemOrder[] | ISItemOrder[];
}
const TableOrderBookList = ({ item_order }: Props) => {
  return (
    <TableBody>
      {item_order.map((item) => (
        <TableOrderBookItem
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

export default TableOrderBookList;

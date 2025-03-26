import { TableBody } from '@/components/ui/table';
import { BookSellingSale } from '@/model/staff.model';
import React from 'react';
import TableBookSellingItem from './TableBookSellingItem';

interface Props {
  data: BookSellingSale[];
}

const TableBooksSellingList = ({ data }: Props) => {
  return (
    <TableBody>
      {data.map((item) => (
        <TableBookSellingItem
          key={item.book_title}
          book_title={item.book_title}
          quantity={item.quantity}
          book_price={item.book_price}
          calc={item.calc}
        />
      ))}
    </TableBody>
  );
};

export default TableBooksSellingList;

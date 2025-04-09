import { TableBody } from '@/components/ui/table';
import { BookBorrowingSale, BookSellingSale } from '@/model/staff.model';
import React from 'react';
import TableBookSellingItem from './TableBookSellingItem';

interface Props {
  data: BookSellingSale[] | BookBorrowingSale[];
}

const TableBooksSellingList = ({ data }: Props) => {
  return (
    <TableBody>
      {data.map((item) => (
        <TableBookSellingItem key={item.book_title} data={{ ...item }} />
      ))}
    </TableBody>
  );
};

export default TableBooksSellingList;

import { TableCell, TableRow } from '@/components/ui/table';
import { BookBorrowingSale, BookSellingSale } from '@/model/staff.model';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import React from 'react';

interface Props {
  data: BookSellingSale | BookBorrowingSale;
}
const TableBookSellingItem = ({ data }: Props) => {
  return (
    <TableRow className="font-medium text-zinc-800 text-xs text-center">
      <TableCell className="max-w-10  break_text capitalize">
        {data.book_title}
      </TableCell>
      {'book_price' in data && (
        <TableCell>{formatNumberToRupiah(data.book_price)}</TableCell>
      )}
      <TableCell>{data.quantity}</TableCell>
      {'calc' in data && (
        <TableCell> {formatNumberToRupiah(data.calc)}</TableCell>
      )}
      <TableCell></TableCell>
    </TableRow>
  );
};

export default TableBookSellingItem;

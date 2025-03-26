import { TableCell, TableRow } from '@/components/ui/table';
import { BookSellingSale } from '@/model/staff.model';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import React from 'react';

const TableBookSellingItem = ({
  book_title,
  quantity,
  book_price,
  calc,
}: BookSellingSale) => {
  return (
    <TableRow className="font-medium text-zinc-800 text-xs text-center">
      <TableCell>{book_title}</TableCell>
      <TableCell>Rp {formatNumberToRupiah(book_price)}</TableCell>
      <TableCell>{quantity}</TableCell>
      <TableCell>Rp {formatNumberToRupiah(calc)}</TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};

export default TableBookSellingItem;

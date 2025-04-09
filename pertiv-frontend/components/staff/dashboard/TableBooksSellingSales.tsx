import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookBorrowingSale, BookSellingSale } from '@/model/staff.model';
import React from 'react';
import TableBooksSellingList from './TableBooksSellingList';

interface Props {
  data: BookSellingSale[] | BookBorrowingSale[];
  type: string;
}
const TableBooksSellingSales = ({ data, type }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">TITLE</TableHead>
          {type !== 'bookBorrowing' && (
            <TableHead className="text-center">PRICE</TableHead>
          )}
          <TableHead className="text-center">QTY</TableHead>
          {type !== 'bookBorrowing' && (
            <TableHead className="text-center">TOTAL</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBooksSellingList data={data} />
    </Table>
  );
};

export default TableBooksSellingSales;

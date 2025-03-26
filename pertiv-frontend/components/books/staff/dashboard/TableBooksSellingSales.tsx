import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookSellingSale } from '@/model/staff.model';
import React from 'react';
import TableBooksSellingList from './TableBooksSellingList';

interface Props {
  data: BookSellingSale[];
}
const TableBooksSellingSales = ({ data }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">TITLE</TableHead>
          <TableHead className="text-center">PRICE</TableHead>
          <TableHead className="text-center">QTY</TableHead>
          <TableHead className="text-center">TOTAL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBooksSellingList data={data} />
    </Table>
  );
};

export default TableBooksSellingSales;

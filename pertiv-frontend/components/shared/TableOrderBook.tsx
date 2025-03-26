import { ISItemOrder } from '@/model/staff.model';
import { IItemOrder } from '@/model/user.model';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollText } from 'lucide-react';
import { Table, TableHead, TableHeader, TableRow } from '../ui/table';
import TableOrderBookList from './TableOrderBookList';

interface Props {
  item_order: IItemOrder[] | ISItemOrder[];
}

const TableOrderBook = ({ item_order }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 items-center">
          <ScrollText />
          <CardTitle>Book Items</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] hidden md:table-cell">
                Image
              </TableHead>
              <TableHead className="max-w-[150px]">Item Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableOrderBookList item_order={item_order} />
        </Table>
      </CardContent>
    </Card>
  );
};

export default TableOrderBook;

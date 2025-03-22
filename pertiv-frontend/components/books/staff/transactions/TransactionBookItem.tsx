import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollText } from 'lucide-react';
import { Table, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { ISItemOrder } from '@/model/staff.model';
import TransactionBookList from './TransactionBookList';

interface Props {
  item_order: ISItemOrder[];
}

const TransactionBookItem = ({ item_order }: Props) => {
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
          <TransactionBookList item_order={item_order} />
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionBookItem;

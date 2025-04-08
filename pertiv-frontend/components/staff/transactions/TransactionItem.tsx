'use client';

import React, { useState } from 'react';
import { ISBorrowTransaction, ISTransaction } from '@/model/staff.model';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatDateTime } from '@/utils/formatDateTime';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import DateInformation from './DateInformation';
import TableOrderBook from '@/components/shared/TableOrderBook';
import { Button } from '@/components/ui/button';
import { acceptLoanBook } from '@/lib/actions/staff.action';
import { toast } from '@/hooks/use-toast';

interface Props {
  item: ISTransaction | ISBorrowTransaction;
  mode: string;
  token?: string;
}
const TransactionItem = ({ item, mode, token }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const backgroundBadge =
    item.status === 'pending'
      ? 'badge_pending'
      : item.status === 'canceled'
      ? 'badge_canceled'
      : item.status === 'success'
      ? 'badge_success'
      : 'badge_paid';

  const acceptLoanHandler = async () => {
    setIsLoading(true);
    const splitOrderId = item.id.split('#');
    const response = await acceptLoanBook(splitOrderId[1], token);

    if (!response) {
      toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
        duration: 2000,
      });
      setIsLoading(false);
      return;
    }

    if (!response.success && response.statusCode !== 201) {
      toast({
        variant: 'destructive',
        title: response.message,
        duration: 2000,
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: response.message,
      duration: 2000,
    });
    setIsLoading(false);
  };

  return (
    <TableRow className="font-medium text-zinc-800">
      <TableCell className="p-3 font-semibold text-lg">{item.id}</TableCell>
      <TableCell>{item.user.name}</TableCell>
      <TableCell>{item.user.email}</TableCell>
      <TableCell>{formatDateTime(item.created_at)}</TableCell>
      {mode !== 'bookBorrowing' && (
        <TableCell>
          Rp {formatNumberToRupiah((item as ISTransaction).total_price)}
        </TableCell>
      )}
      <TableCell>{(item as ISTransaction).buy_handled_by}</TableCell>
      <TableCell>
        <div className={`${backgroundBadge} max-w-20 rounded-md`}>
          <p className="text-center">{item.status}</p>
        </div>
      </TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger>View Details</DialogTrigger>
          <DialogContent className="overflow-auto max-h-[500px]">
            <DialogHeader>
              <DialogTitle>Details Transaction</DialogTitle>
              <DialogDescription>Order ID : {item.id}</DialogDescription>
            </DialogHeader>
            <TableOrderBook
              item_order={
                (item as ISTransaction).item_order ||
                (item as ISBorrowTransaction).items
              }
              mode={mode}
            />
            <DateInformation
              status={item.status}
              created_at={item.created_at}
              paid_at={(item as ISTransaction).paid_at}
              canceled_at={item.canceled_at}
              buy_date={(item as ISTransaction).buy_date}
              mode={mode}
            />
            {item.status === 'pending' && (
              <div className="flex justify-center gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn_primary"
                  onClick={acceptLoanHandler}
                >
                  Accept
                </Button>
                <Button variant="outline">Reject</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export default TransactionItem;

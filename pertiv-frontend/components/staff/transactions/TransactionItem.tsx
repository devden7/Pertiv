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
import { acceptLoanBook, rejectLoanBook } from '@/lib/actions/staff.action';
import { toast } from '@/hooks/use-toast';
import { badgeStatusColor } from '@/utils/badgeStatusColor';

interface Props {
  item: ISTransaction | ISBorrowTransaction;
  mode: string;
  token?: string;
}
const TransactionItem = ({ item, mode, token }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

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

  const rejectLoanHandler = async () => {
    setIsLoading(true);
    const splitOrderId = item.id.split('#');
    const response = await rejectLoanBook(splitOrderId[1], token);

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
      <TableCell>
        {(item as ISTransaction).buy_handled_by ||
          (item as ISBorrowTransaction).loan_handled_by}
      </TableCell>
      {mode === 'bookBorrowing' && (
        <TableCell>{(item as ISBorrowTransaction).return_handled_by}</TableCell>
      )}
      <TableCell>
        <div className={`${badgeStatusColor(item.status)} max-w-20 rounded-md`}>
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
              canceled_at={item.canceled_at}
              date={{
                paid_at: (item as ISTransaction).paid_at,
                buy_date: (item as ISTransaction).buy_date,
                loan_date: (item as ISBorrowTransaction).loan_date,
                ended_at: (item as ISBorrowTransaction).ended_at,
                date_returned: (item as ISBorrowTransaction).date_returned,
              }}
              mode={mode}
            />
            {item.status === 'pending' && mode === 'bookBorrowing' && (
              <div className="flex justify-center gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn_primary"
                  onClick={acceptLoanHandler}
                >
                  Accept
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isLoading}
                  onClick={rejectLoanHandler}
                >
                  Reject
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export default TransactionItem;

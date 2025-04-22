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
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
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
    setIsOpen(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <TableRow className="font-medium text-zinc-800">
      <TableCell className="p-3 font-semibold text-lg text-center">
        {item.id}
      </TableCell>
      <TableCell className="text-center">{item.user.name}</TableCell>
      <TableCell className="text-center">{item.user.email}</TableCell>
      <TableCell className="text-center">
        {formatDateTime(item.created_at)}
      </TableCell>
      {mode !== 'bookBorrowing' && (
        <TableCell className="text-center">
          {formatNumberToRupiah((item as ISTransaction).total_price)}
        </TableCell>
      )}
      <TableCell className="text-center">
        {(item as ISTransaction).buy_handled_by ||
          (item as ISBorrowTransaction).loan_handled_by}
      </TableCell>
      {mode === 'bookBorrowing' && (
        <TableCell className="text-center">
          {(item as ISBorrowTransaction).return_handled_by}
        </TableCell>
      )}
      <TableCell className="w-[5%]">
        <div className={`${badgeStatusColor(item.status)}  rounded-md`}>
          <p className="text-center p-1">{item.status}</p>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

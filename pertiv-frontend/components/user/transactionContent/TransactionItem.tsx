'use client';

import { IBorrowTransaction, ITransaction } from '@/model/user.model';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import React, { useState } from 'react';
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
import DateInformation from './DateInformation';
import TransactionKey from './transactionKey';
import Link from 'next/link';
import TableOrderBook from '@/components/shared/TableOrderBook';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import { returnLoanBook } from '@/lib/actions/user.action';
import { toast } from '@/hooks/use-toast';
import { badgeStatusColor } from '@/utils/badgeStatusColor';

interface Props {
  mode: string;
  item: ITransaction | IBorrowTransaction;
  token?: string;
}
const TransactionItem = ({ item, mode, token }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const returnBookHandler = async () => {
    setIsLoading(true);
    const splitOrderId = item.id.split('#');
    const response = await returnLoanBook(splitOrderId[1], token);

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
      <TableCell>{formatDateTime(item.created_at)}</TableCell>
      {mode !== 'bookBorrowing' && (
        <TableCell>
          Rp {formatNumberToRupiah((item as ITransaction).total_price)}
        </TableCell>
      )}
      <TableCell>
        <div className={`${badgeStatusColor(item.status)} max-w-20 rounded-md`}>
          <p className="text-center">{item.status}</p>
        </div>
      </TableCell>
      <TableCell>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                <Ellipsis size={15} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left">
              <DropdownMenuItem className="cursor-pointer">
                <DialogTrigger className="w-full text-left">
                  View details
                </DialogTrigger>
              </DropdownMenuItem>
              {item.status === 'borrowed' && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={returnBookHandler}
                  disabled={isLoading}
                >
                  Return book
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="overflow-auto max-h-[500px]">
            <DialogHeader>
              <DialogTitle>Details Transaction</DialogTitle>
              <DialogDescription>Order ID : {item.id}</DialogDescription>
            </DialogHeader>
            <TableOrderBook
              item_order={
                (item as ITransaction).item_Order ||
                (item as IBorrowTransaction).items
              }
              mode={mode}
            />
            <TransactionKey
              status={item.status}
              keyValue={
                (item as ITransaction).buy_key ||
                (item as IBorrowTransaction).returned_key ||
                (item as IBorrowTransaction).loan_key
              }
            />
            <DateInformation
              status={item.status}
              created_at={item.created_at}
              date={{
                paid_at: (item as ITransaction).paid_at,
                buy_date: (item as ITransaction).buy_date,
                loan_date: (item as IBorrowTransaction).loan_date,
                ended_at: (item as IBorrowTransaction).ended_at,
                date_returned: (item as IBorrowTransaction).date_returned,
              }}
              canceled_at={item.canceled_at}
              mode={mode}
            />
            {item.status === 'pending' && mode !== 'bookBorrowing' && (
              <p className="text-center text-zinc-700">
                For payment please visit this{' '}
                <Link
                  href={`/payment/${item.id.split('#')[1]}`}
                  className="text-primary-500 font-medium"
                >
                  Link
                </Link>
              </p>
            )}
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export default TransactionItem;

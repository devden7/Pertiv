import { IBorrowTransaction, ITransaction } from '@/model/user.model';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import React from 'react';
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

interface Props {
  mode: string;
  item: ITransaction | IBorrowTransaction;
}
const TransactionItem = ({ item, mode }: Props) => {
  const backgroundBadge =
    item.status === 'pending'
      ? 'badge_pending'
      : item.status === 'canceled'
      ? 'badge_canceled'
      : item.status === 'success'
      ? 'badge_success'
      : 'badge_paid';
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
                (item as ITransaction).item_Order ||
                (item as IBorrowTransaction).items
              }
              mode={mode}
            />
            <TransactionKey
              status={item.status}
              keyValue={
                (item as ITransaction).buy_key ||
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

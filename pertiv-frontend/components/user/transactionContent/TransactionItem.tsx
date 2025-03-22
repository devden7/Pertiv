import { ITransaction } from '@/model/user.model';
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
import TransactionBookItem from './TransactionBookItem';
import DateInformation from './DateInformation';
import TransactionKey from './transactionKey';
import Link from 'next/link';
const TransactionItem = ({
  id,
  status,
  buy_key,
  buy_handled_by,
  buy_date,
  total_price,
  created_at,
  ended_at,
  canceled_at,
  paid_at,
  item_Order,
}: ITransaction) => {
  const backgroundBadge =
    status === 'pending'
      ? 'badge_pending'
      : status === 'canceled'
      ? 'badge_canceled'
      : 'badge_paid';
  return (
    <TableRow className="font-medium text-zinc-800">
      <TableCell className="p-3 font-semibold text-lg">{id}</TableCell>
      <TableCell>{formatDateTime(created_at)}</TableCell>
      <TableCell>Rp {formatNumberToRupiah(total_price)}</TableCell>
      <TableCell>
        <div className={`${backgroundBadge} max-w-20 rounded-md`}>
          <p className="text-center">{status}</p>
        </div>
      </TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger>View Details</DialogTrigger>
          <DialogContent className="overflow-auto max-h-[500px]">
            <DialogHeader>
              <DialogTitle>Details Transaction</DialogTitle>
              <DialogDescription>Order ID : {id}</DialogDescription>
            </DialogHeader>
            <TransactionBookItem item_Order={item_Order} />
            <TransactionKey status={status} buy_key={buy_key} />
            <DateInformation
              status={status}
              created_at={created_at}
              paid_at={paid_at}
              canceled_at={canceled_at}
            />
            {status === 'pending' && (
              <p className="text-center text-zinc-700">
                For payment please visit this{' '}
                <Link
                  href={`/payment/${id.split('#')[1]}`}
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

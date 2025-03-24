import React from 'react';
import { ISTransaction } from '@/model/staff.model';
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
import TransactionBookItem from './TransactionBookItem';
import DateInformation from './DateInformation';

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
  userId,
  user,
  item_order,
}: ISTransaction) => {
  const backgroundBadge =
    status === 'pending'
      ? 'badge_pending'
      : status === 'canceled'
      ? 'badge_canceled'
      : status === 'success'
      ? 'badge_success'
      : 'badge_paid';
  return (
    <TableRow className="font-medium text-zinc-800">
      <TableCell className="p-3 font-semibold text-lg">{id}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{formatDateTime(created_at)}</TableCell>
      <TableCell>Rp {formatNumberToRupiah(total_price)}</TableCell>
      <TableCell>{buy_handled_by}</TableCell>
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
            <TransactionBookItem item_order={item_order} />
            <DateInformation
              status={status}
              created_at={created_at}
              paid_at={paid_at}
              canceled_at={canceled_at}
              buy_date={buy_date}
            />
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export default TransactionItem;

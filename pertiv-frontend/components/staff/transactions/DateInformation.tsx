import React from 'react';
import { Timer } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDateTime } from '@/utils/formatDateTime';

interface dateBookSelling {
  paid_at: string;
  buy_date: string;
}

interface dateBookBorrowing {
  loan_date: string;
  ended_at: string;
  date_returned: string;
}

interface Props {
  status: string;
  created_at: string;
  canceled_at: string;
  date: dateBookSelling | dateBookBorrowing;
  mode: string;
}
const DateInformation = ({
  status,
  created_at,
  canceled_at,
  date,
  mode,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 items-center">
          <Timer />
          <CardTitle>Date information</CardTitle>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="mt-3">
        <div className="flex items-center justify-between font-medium">
          <div>{mode !== 'bookBorrowing' ? 'Order date' : 'Loan date'}</div>
          <div className="text-zinc-600">{formatDateTime(created_at)}</div>
        </div>

        {(status === 'paid' ||
          status === 'success' ||
          (status !== 'canceled' &&
            status !== 'pending' &&
            status !== 'accepted')) && (
          <div className="flex items-center justify-between font-medium mt-3">
            <div>
              {mode !== 'bookBorrowing' ? 'Paid date' : 'Loan accept date'}
            </div>
            <div className="text-zinc-600">
              {formatDateTime(
                (date as dateBookSelling).paid_at ||
                  (date as dateBookBorrowing).loan_date
              )}
            </div>
          </div>
        )}
        {status === 'borrowed' && (
          <div className="flex items-center justify-between font-medium mt-3 text-red-500">
            <div>Max returned date</div>
            <div>{formatDateTime((date as dateBookBorrowing).ended_at)}</div>
          </div>
        )}
        {status === 'canceled' && (
          <div className="flex items-center justify-between font-medium mt-3">
            <div>Canceled date</div>
            <div className="text-zinc-600">{formatDateTime(canceled_at)}</div>
          </div>
        )}
        {status === 'success' && (
          <div className="flex items-center justify-between font-medium mt-3">
            <div>Success date</div>
            <div className="text-zinc-600">
              {formatDateTime((date as dateBookSelling).buy_date)}
            </div>
          </div>
        )}

        {status === 'returned' && (
          <div className="flex items-center justify-between font-medium mt-3">
            <div>Returned date</div>
            <div className="text-zinc-600">
              {formatDateTime((date as dateBookBorrowing).date_returned)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DateInformation;

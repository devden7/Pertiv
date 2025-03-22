import React from 'react';
import { Timer } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDateTime } from '@/utils/formatDateTime';

interface Props {
  status: string;
  created_at: string;
  canceled_at: string;
  paid_at: string;
}
const DateInformation = ({
  status,
  created_at,
  canceled_at,
  paid_at,
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
          <div>Order date</div>
          <div className="text-zinc-600">{formatDateTime(created_at)}</div>
        </div>

        {status === 'paid' && (
          <div className="flex items-center justify-between font-medium mt-3">
            <div>Paid Date</div>
            <div className="text-zinc-600">{formatDateTime(paid_at)}</div>
          </div>
        )}
        {status === 'canceled' && (
          <div className="flex items-center justify-between font-medium mt-3">
            <div>Canceled Date</div>
            <div className="text-zinc-600">{formatDateTime(canceled_at)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DateInformation;

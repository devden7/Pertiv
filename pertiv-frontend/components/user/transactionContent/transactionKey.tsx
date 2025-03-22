import React from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Key } from 'lucide-react';

interface Props {
  status: string;
  buy_key: string;
}
const TransactionKey = ({ status, buy_key }: Props) => {
  return (
    status === 'paid' && (
      <Card>
        <CardHeader>
          <div className="flex gap-2 items-center">
            <Key />
            <CardTitle>Key</CardTitle>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="mt-3">
          <p className="text-center text-sm font-medium text-red-500">
            *When you take the book, give this key to the staff.
          </p>
          <p className="text-center text-2xl font-bold text-zinc-800">
            {buy_key}
          </p>
        </CardContent>
      </Card>
    )
  );
};

export default TransactionKey;

import React from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Key } from 'lucide-react';

interface Props {
  status: string;
  keyValue: string;
}
const TransactionKey = ({ status, keyValue }: Props) => {
  return (
    (status === 'paid' || status === 'Take book') && (
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
            *Please give this key to the staff for confirmation.
          </p>
          <p className="text-center text-2xl font-bold text-zinc-800">
            {keyValue}
          </p>
        </CardContent>
      </Card>
    )
  );
};

export default TransactionKey;

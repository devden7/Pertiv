'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import PaymentBookList from './PaymentBookList';
import { formatDateTime } from '@/utils/formatDateTime';
import { formatNumberToRupiah } from '@/utils/formatRupiah';
import { Badge } from '../ui/badge';
import { HandCoins, ScrollText } from 'lucide-react';
import { cancelPurchaseBook, purchaseBook } from '@/lib/actions/user.action';
import { useToast } from '@/hooks/use-toast';

interface Props {
  data: {
    id: string;
    status: string;
    total_price: number;
    created_at: string;
    ended_at: string;
    item_Order: [
      {
        id: string;
        book_title: string;
        book_imageUrl: string;
        book_price: 0;
        quantity: 0;
      }
    ];
  };
  token?: string;
}

const PaymentContent = ({ data, token }: Props) => {
  const { toast } = useToast();

  const purchaseHandler = async () => {
    const splitOrderId = data.id.split('#');
    const response = await purchaseBook(splitOrderId[1], token);

    if (!response || !response.success) {
      toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
        duration: 2000,
      });

      return;
    }
  };

  const cancelPurchaseHandler = async () => {
    const splitOrderId = data.id.split('#');
    const response = await cancelPurchaseBook(splitOrderId[1], token);

    if (!response || !response.success) {
      toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
        duration: 2000,
      });

      return;
    }
  };
  return (
    <section>
      <div className="container">
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-semibold text-lg md:text-xl">
                {data.id} -{' '}
                <span className="font-normal text-gray-500 dark:text-gray-400">
                  {formatDateTime(data.created_at)}
                </span>
              </h1>
            </div>
            <div>
              {data.status === 'pending' && (
                <Badge className="capitalize bg-yellow-100 hover:bg-yellow-100 text-yellow-800">
                  {data.status}
                </Badge>
              )}
              {data.status === 'canceled' && (
                <Badge className="capitalize bg-red-100 hover:bg-red-100 text-red-800">
                  {data.status}
                </Badge>
              )}
              {data.status === 'paid' && (
                <Badge className="capitalize bg-blue-100 hover:bg-blue-100 text-blue-8000">
                  {data.status}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-6 gap-6">
            <div className="md:col-span-4 lg:col-span-3 xl:col-span-4 flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <div className="flex gap-2 items-center">
                    <ScrollText />
                    <CardTitle>Book Items</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] hidden md:table-cell">
                          Image
                        </TableHead>
                        <TableHead className="max-w-[150px]">
                          Item Name
                        </TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <PaymentBookList item_order={data.item_Order} />
                  </Table>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <div className="flex gap-2 items-center">
                    <HandCoins />
                    <CardTitle>Payment</CardTitle>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="mt-3">
                  <div className="flex items-center justify-between font-medium">
                    <div>Total</div>
                    <div className="ml-auto">
                      Rp {formatNumberToRupiah(data.total_price)}
                    </div>
                  </div>
                  {data.status === 'pending' && (
                    <div className="flex items-center justify-between font-medium mt-3 text-red-500">
                      <div>Payment due by</div>
                      <div>{formatDateTime(data.ended_at)}</div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex items-center gap-2">
                  {data.status === 'pending' && (
                    <Button
                      size="sm"
                      className="bg-primary-500 hover:bg-primary-600"
                      onClick={purchaseHandler}
                    >
                      Pay now
                    </Button>
                  )}
                  {data.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelPurchaseHandler}
                    >
                      Cancel
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentContent;

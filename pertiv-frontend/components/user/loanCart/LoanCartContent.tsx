'use client';

import { Card } from '@/components/ui/card';
import { ILoanCartList } from '@/model/user.model';
import React, { useState } from 'react';
import LoanCartList from './LoanCartList';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { borrowingBook } from '@/lib/actions/user.action';

interface Props {
  data: ILoanCartList;
  token?: string;
}

const LoanCartContent = ({ data, token }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const borrowHandler = async () => {
    setIsLoading(true);
    const cartItem = data.collection_item.map((item) => {
      return {
        book_id: item.id,
      };
    });

    const response = await borrowingBook(cartItem, token);

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

    router.push('/transactions');

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <section>
      <div className="container">
        <div className="flex justify-center items-center my-2">
          <Card className="w-1/2 p-2 max-sm:w-full">
            <h1 className="text-xl font-medium text-center">Books Loan Cart</h1>
            <LoanCartList data={data} token={token} />
            <div className="mt-3 flex justify-center">
              <Button
                className="bg-primary-500 hover:bg-primary-600"
                disabled={isLoading}
                onClick={() => borrowHandler()}
              >
                Borow Now
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LoanCartContent;

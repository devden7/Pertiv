import { Card } from '@/components/ui/card';
import { ILoanCartList } from '@/model/user.model';
import React from 'react';
import LoanCartList from './LoanCartList';
import { Button } from '@/components/ui/button';

interface Props {
  data: ILoanCartList;
  token?: string;
}

const LoanCartContent = ({ data, token }: Props) => {
  return (
    <section>
      <div className="container">
        <div className="flex justify-center items-center my-2">
          <Card className="w-1/2 p-2">
            <h1 className="text-xl font-medium text-center">Books Loan Cart</h1>
            <LoanCartList data={data} token={token} />
            <div className="mt-3 flex justify-center">
              <Button className="bg-primary-500 hover:bg-primary-600">
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

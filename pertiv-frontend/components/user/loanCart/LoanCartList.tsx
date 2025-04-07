import { ILoanCartList } from '@/model/user.model';
import React from 'react';
import LoanCartItem from './LoanCartItem';

interface Props {
  data: ILoanCartList;
  token?: string;
}

const LoanCartList = ({ data, token }: Props) => {
  return (
    <div>
      {data.collection_item.map((item) => (
        <LoanCartItem
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          imageUrl={item.imageUrl}
          token={token}
        />
      ))}
    </div>
  );
};

export default LoanCartList;

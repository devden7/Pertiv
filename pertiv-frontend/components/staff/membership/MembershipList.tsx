import { TableBody } from '@/components/ui/table';
import { IMembershipType } from '@/model/staff.model';
import React from 'react';
import MembershipItem from './MembershipItem';

interface Props {
  data: IMembershipType[];
  token?: string;
}
const MembershipList = ({ data, token }: Props) => {
  return (
    <TableBody>
      {data.map((item) => (
        <MembershipItem
          key={item.id}
          name={item.name}
          description={item.description}
          durationDays={item.durationDays}
          maxBorrow={item.maxBorrow}
          maxReturn={item.maxReturn}
          price={item.price}
          id={item.id}
          token={token}
        />
      ))}
    </TableBody>
  );
};

export default MembershipList;

import { TableCell, TableRow } from '@/components/ui/table';
import { IMembershipType } from '@/model/staff.model';
import React from 'react';

interface Props extends IMembershipType {
  token?: string;
}
const MembershipItem = ({
  name,
  description,
  durationDays,
  maxBorrow,
  maxReturn,
  price,
}: Props) => {
  return (
    <TableRow className="font-medium text-zinc-800">
      <TableCell className="text-center">{name}</TableCell>
      <TableCell className="text-center">{description}</TableCell>
      <TableCell className="text-center">{durationDays}</TableCell>
      <TableCell className="text-center">{maxBorrow}</TableCell>
      <TableCell className="text-center">{maxReturn}</TableCell>
      <TableCell className="text-center">{price}</TableCell>
      <TableCell className="text-center">...</TableCell>
    </TableRow>
  );
};

export default MembershipItem;

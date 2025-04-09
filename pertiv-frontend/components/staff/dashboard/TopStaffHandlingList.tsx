import { TableBody } from '@/components/ui/table';
import {
  StaffBookSellingHandle,
  staffHandlingLoan,
  staffHandlingReturn,
} from '@/model/staff.model';
import React from 'react';
import TableStaffHandlingItem from './TableStaffHandlingItem';

interface Props {
  data: StaffBookSellingHandle[] | staffHandlingLoan[] | staffHandlingReturn[];
}

const TopStaffHandlingList = ({ data }: Props) => {
  return (
    <TableBody>
      {data.map((item) => (
        <TableStaffHandlingItem key={item.staffName} data={{ ...item }} />
      ))}
    </TableBody>
  );
};

export default TopStaffHandlingList;

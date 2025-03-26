import { TableBody } from '@/components/ui/table';
import { StaffBookSellingHandle } from '@/model/staff.model';
import React from 'react';
import TableStaffHandlingItem from './TableStaffHandlingItem';

interface Props {
  data: StaffBookSellingHandle[];
}

const TopStaffHandlingList = ({ data }: Props) => {
  return (
    <TableBody>
      {data.map((item) => (
        <TableStaffHandlingItem
          key={item.staffName}
          staffName={item.staffName}
          totalHandledSuccess={item.totalHandledSuccess}
        />
      ))}
    </TableBody>
  );
};

export default TopStaffHandlingList;

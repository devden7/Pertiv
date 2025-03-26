import { TableCell, TableRow } from '@/components/ui/table';
import { StaffBookSellingHandle } from '@/model/staff.model';
import React from 'react';

const TableStaffHandlingItem = ({
  staffName,
  totalHandledSuccess,
}: StaffBookSellingHandle) => {
  return (
    <TableRow className="font-medium text-zinc-800 text-xs text-center">
      <TableCell>{staffName}</TableCell>
      <TableCell>{totalHandledSuccess}</TableCell>
    </TableRow>
  );
};

export default TableStaffHandlingItem;

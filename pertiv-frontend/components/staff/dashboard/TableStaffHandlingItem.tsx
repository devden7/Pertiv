import { TableCell, TableRow } from '@/components/ui/table';
import {
  StaffBookSellingHandle,
  staffHandlingLoan,
  staffHandlingReturn,
} from '@/model/staff.model';
import React from 'react';
interface Props {
  data: StaffBookSellingHandle | staffHandlingLoan | staffHandlingReturn;
}
const TableStaffHandlingItem = ({ data }: Props) => {
  return (
    <TableRow className="font-medium text-zinc-800 text-xs text-center">
      <TableCell>{data.staffName}</TableCell>
      <TableCell>
        {(data as StaffBookSellingHandle).totalHandledSuccess ||
          (data as staffHandlingLoan).totalLoanHandled ||
          (data as staffHandlingReturn).totalReturnHandled}
      </TableCell>
    </TableRow>
  );
};

export default TableStaffHandlingItem;

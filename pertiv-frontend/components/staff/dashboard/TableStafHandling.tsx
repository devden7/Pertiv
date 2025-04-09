import {
  StaffBookSellingHandle,
  staffHandlingLoan,
  staffHandlingReturn,
} from '@/model/staff.model';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import TopStaffHandlingList from './TopStaffHandlingList';

interface Props {
  data: StaffBookSellingHandle[] | staffHandlingLoan[] | staffHandlingReturn[];
  type: string;
}

const TableStafHandling = ({ data, type }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Email</TableHead>
          <TableHead className="text-center">{type}</TableHead>
        </TableRow>
      </TableHeader>
      <TopStaffHandlingList data={data} />
    </Table>
  );
};

export default TableStafHandling;

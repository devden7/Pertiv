import {
  StaffBookSellingHandle,
  staffHandlingLoan,
  staffHandlingReturn,
} from '@/model/staff.model';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TableStafHandling from './TableStafHandling';

interface Props {
  data: StaffBookSellingHandle[] | staffHandlingLoan[] | staffHandlingReturn[];
  title: string;
  type: string;
}
const TopStaffHandling = ({ data, title, type }: Props) => {
  return (
    <Card className="flex flex-col mt-3">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>Staff handling success transaction</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <TableStafHandling data={data} type={type} />
      </CardContent>
    </Card>
  );
};

export default TopStaffHandling;

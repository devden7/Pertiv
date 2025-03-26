import { StaffBookSellingHandle } from '@/model/staff.model';
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
  data: StaffBookSellingHandle[];
}
const TopStaffHandling = ({ data }: Props) => {
  return (
    <Card className="flex flex-col mt-3">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 10 Staff Handling</CardTitle>
        <CardDescription>Staff handling success transaction</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <TableStafHandling data={data} />
      </CardContent>
    </Card>
  );
};

export default TopStaffHandling;

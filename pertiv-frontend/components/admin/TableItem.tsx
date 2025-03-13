/* eslint-disable @typescript-eslint/no-unused-vars */
import { TableCell, TableRow } from '@/components/ui/table';
import { IStaff } from '@/model/admin.module';

const TableItem = ({ index = 0, id, email, name, role, image }: IStaff) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{role}</TableCell>
    </TableRow>
  );
};

export default TableItem;

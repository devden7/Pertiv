import { TableBody } from '@/components/ui/table';
import { IStaff } from '@/model/admin.module';
import TableItem from './TableItem';

interface Props {
  data: IStaff[];
  token?: string;
}

const TableList = ({ data, token }: Props) => {
  return (
    <TableBody>
      {data.map((item, index) => (
        <TableItem
          key={item.id}
          id={item.id}
          email={item.email}
          name={item.name}
          role={item.role}
          image={item.image}
          index={index}
          token={token}
        />
      ))}
    </TableBody>
  );
};

export default TableList;

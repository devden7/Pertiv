import { TableBody } from '@/components/ui/table';
import { IStaff } from '@/model/admin.module';
import TableItem from './TableItem';

interface Props {
  data: IStaff[];
}

const TableList = ({ data }: Props) => {
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
        />
      ))}
    </TableBody>
  );
};

export default TableList;

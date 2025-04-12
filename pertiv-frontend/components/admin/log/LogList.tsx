import { TableBody } from '@/components/ui/table';
import { ILogs } from '@/model/admin.model';
import React from 'react';
import LogItem from './LogItem';

interface Props {
  data: ILogs[];
}

const LogList = ({ data }: Props) => {
  return (
    <TableBody>
      {data.map((item) => (
        <LogItem
          key={item.id}
          id={item.id}
          level={item.level}
          message={item.message}
          createdAt={item.createdAt}
        />
      ))}
    </TableBody>
  );
};

export default LogList;

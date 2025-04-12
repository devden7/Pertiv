import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { ILogs } from '@/model/admin.model';
import { formatDateTime } from '@/utils/formatDateTime';
import { subHours } from 'date-fns';
import React from 'react';

const LogItem = ({ level, message, createdAt }: ILogs) => {
  return (
    <TableRow className="text-center">
      <TableCell>
        {level === 'info' && <Badge variant="outline">{level}</Badge>}
        {level === 'error' && <Badge className="bg-red-500">{level}</Badge>}
      </TableCell>
      <TableCell className="max-w-64 max-sm:overflow-hidden">
        {message}
      </TableCell>
      <TableCell>{formatDateTime(subHours(createdAt, 7))}</TableCell>
    </TableRow>
  );
};

export default LogItem;

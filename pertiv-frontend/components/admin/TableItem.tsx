/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { IStaff } from '@/model/admin.module';
import { Button } from '../ui/button';
import DialogComponent from '../DialogComponent';
import StaffForm from './StaffForm';

const TableItem = ({ index = 0, id, email, name, role, image }: IStaff) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TableRow>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{role}</TableCell>
      <TableCell>
        <div>
          <div>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              Details
            </Button>
            <DialogComponent
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title="Update Staff"
              description="Update a staff account"
            >
              <StaffForm
                setIsOpen={setIsOpen}
                email={email}
                name={name}
                id={id}
                type="Edit"
              />
            </DialogComponent>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;

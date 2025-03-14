/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { IStaff } from '@/model/admin.module';
import { Button } from '../ui/button';
import DialogComponent from '../DialogComponent';
import StaffForm from './StaffForm';
import { deleteStaff } from '@/lib/actions/admin/admin.action';
import { useToast } from '@/hooks/use-toast';

interface Props extends IStaff {
  token?: string;
}
const TableItem = ({
  index = 0,
  id,
  email,
  name,
  role,
  image,
  token,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const deleteStaffHandler = async (id: string) => {
    const response = await deleteStaff(id, token);
    if (!response) {
      return toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
      });
    }

    if (!response.success && response.statusCode !== 201) {
      return console.log('Error Response');
    }

    toast({
      description: response.message,
      duration: 2000,
    });
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{role}</TableCell>
      <TableCell>
        <div className="flex gap-2 flex-wrap">
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
          <div>
            <Button
              className="bg-red-500 hover:bg-red-700"
              onClick={() => deleteStaffHandler(id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;

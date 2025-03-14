'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import StaffForm from './StaffForm';
import DialogComponent from '../DialogComponent';

interface Props {
  token?: string;
}
const AddStaff = ({ token }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Add Staff
      </Button>
      <DialogComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Add Staff"
        description="Add a new staff"
      >
        <StaffForm setIsOpen={setIsOpen} type="Add" token={token} />
      </DialogComponent>
    </>
  );
};

export default AddStaff;

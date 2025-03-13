'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import StaffForm from './StaffForm';
import DialogComponent from '../DialogComponent';

const AddStaff = () => {
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
        <StaffForm setIsOpen={setIsOpen} />
      </DialogComponent>
    </>
  );
};

export default AddStaff;

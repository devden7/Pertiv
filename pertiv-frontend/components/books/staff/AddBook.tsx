'use client';

import DialogComponent from '@/components/DialogComponent';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import BookForm from './BookForm';

interface Props {
  token?: string;
}
const AddBook = ({ token }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button className="mb-2" onClick={() => setIsOpen(true)}>
        Add Books
      </Button>
      <DialogComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Add book"
        description="Add a new book"
      >
        <BookForm token={token} setIsOpen={setIsOpen} type="Add" />
      </DialogComponent>
    </>
  );
};

export default AddBook;

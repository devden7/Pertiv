'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import BookForm from './BookForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
  token?: string;
}

const AddBook = ({ token }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [mode, setMode] = useState('bookSelling');

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-2 btn_primary">Add Books</Button>
        </DialogTrigger>
        <DialogContent className="overflow-auto max-h-[500px]">
          <DialogHeader>
            <div className="flex justify-between">
              <div>
                <DialogTitle>Add book</DialogTitle>
                <DialogDescription>Add a new book</DialogDescription>
              </div>
              <Select value={mode} onValueChange={(value) => setMode(value)}>
                <SelectTrigger className="w-[140px] mr-5">
                  <SelectValue placeholder="Book for selling" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bookSelling">Book Selling</SelectItem>
                  <SelectItem value="bookBorrowing">Book Borrowing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DialogHeader>
          <BookForm
            token={token}
            imageUrl={null}
            setIsOpen={setIsOpen}
            type="Add"
            mode={mode}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddBook;

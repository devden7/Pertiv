'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import MembershipForm from './MembershipForm';

interface Props {
  token?: string;
}
const AddMembership = ({ token }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-2 btn_primary">Add membership type</Button>
      </DialogTrigger>
      <DialogContent className="overflow-auto max-h-[500px]">
        <DialogHeader>
          <div className="flex justify-between">
            <div>
              <DialogTitle>Add membership</DialogTitle>
              <DialogDescription>
                Add detail field for membership type
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <MembershipForm token={token} setIsOpen={setIsOpen} type="Add" />
      </DialogContent>
    </Dialog>
  );
};

export default AddMembership;

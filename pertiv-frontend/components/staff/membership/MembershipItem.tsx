'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { IMembershipType } from '@/model/staff.model';
import { Ellipsis } from 'lucide-react';
import React, { useState } from 'react';
import MembershipForm from './MembershipForm';
import { useToast } from '@/hooks/use-toast';
import { deleteMembershipType } from '@/lib/actions/staff.action';

interface Props extends IMembershipType {
  token?: string;
}
const MembershipItem = ({
  id,
  name,
  description,
  durationDays,
  maxBorrow,
  maxReturn,
  price,
  token,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const deleteMembershipHandler = async (id: string) => {
    const response = await deleteMembershipType(id, token);
    if (!response) {
      return toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
      });
    }
    if (!response.success && response.statusCode !== 201) {
      return toast({
        variant: 'destructive',
        title: response.message,
        duration: 2000,
      });
    }

    toast({
      description: response.message,
      duration: 2000,
    });
  };
  return (
    <TableRow className="font-medium text-zinc-800">
      <TableCell className="text-center capitalize">{name}</TableCell>
      <TableCell className="text-center">{description}</TableCell>
      <TableCell className="text-center">{durationDays}</TableCell>
      <TableCell className="text-center">{maxBorrow}</TableCell>
      <TableCell className="text-center">{maxReturn}</TableCell>
      <TableCell className="text-center">{price}</TableCell>
      <TableCell className="text-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                <Ellipsis size={15} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left">
              <DropdownMenuItem className="cursor-pointer">
                <DialogTrigger className="w-full text-left">Edit</DialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => deleteMembershipHandler(id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="overflow-auto max-h-[500px]">
            <DialogHeader>
              <DialogTitle>Add membership type</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Add membership package for user
              </DialogDescription>
            </DialogHeader>
            <MembershipForm
              id={id}
              name={name}
              description={description}
              durationDays={durationDays}
              maxBorrow={maxBorrow}
              maxReturn={maxReturn}
              price={price}
              token={token}
              setIsOpen={setIsOpen}
              type="Edit"
            />
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export default MembershipItem;

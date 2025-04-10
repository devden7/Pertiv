'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  confirmLoanTransaction,
  confirmOrderTransaction,
  confirmReturnedTransaction,
} from '@/lib/actions/staff.action';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  token?: string;
}
const FormConfirmBook = ({ token }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('');
  const { toast } = useToast();
  const formSchema = z.object({
    keyValue: z.string().min(5, {
      message: 'Input is not valid',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyValue: '',
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response =
      transactionType === 'order'
        ? await confirmOrderTransaction(values.keyValue, token)
        : transactionType === 'loan'
        ? await confirmLoanTransaction(values.keyValue, token)
        : await confirmReturnedTransaction(values.keyValue, token);

    if (!response) {
      return toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
        duration: 2000,
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
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="mb-3 btn_primary">Confirm transaction</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setTransactionType('order')}
          >
            <DialogTrigger className="w-full text-left">
              Order book
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setTransactionType('loan')}
          >
            <DialogTrigger className="w-full text-left">
              Loan book
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setTransactionType('returned')}
          >
            <DialogTrigger className="w-full text-left">
              Returned book
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="overflow-auto max-h-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm book transaction</DialogTitle>
          <DialogDescription className="text-red-500 font-medium">
            *Input the KEY transaction in this field
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="keyValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Key of the transaction" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FormConfirmBook;

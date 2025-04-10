import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  addMembershipType,
  updateMembershipType,
} from '@/lib/actions/staff.action';
import { formMembershipSchema } from '@/model/staff.model';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  id?: string;
  name?: string;
  description?: string;
  durationDays?: number;
  maxBorrow?: number;
  maxReturn?: number;
  price?: number;
  type: string;
  token?: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MembershipForm = ({
  id,
  name,
  description,
  durationDays,
  maxBorrow,
  maxReturn,
  price,
  type,
  token,
  setIsOpen,
}: Props) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formMembershipSchema>>({
    resolver: zodResolver(formMembershipSchema),
    defaultValues: {
      name: name || '',
      description: description || '',
      durationDays: durationDays || 0,
      maxBorrow: maxBorrow || 0,
      maxReturn: maxReturn || 0,
      price: price || 0,
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formMembershipSchema>) => {
    const response =
      type !== 'Edit'
        ? await addMembershipType(values, token)
        : await updateMembershipType(id!, values, token);

    if (!response) {
      toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
        duration: 2000,
      });

      return;
    }

    if (!response.success && response.statusCode !== 201) {
      toast({
        variant: 'destructive',
        title: response.message[0].msg,
        duration: 2000,
      });

      return;
    }
    toast({
      description: response.message,
      duration: 2000,
    });
    setIsOpen(false);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of the membership type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Description of the membership type"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="durationDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration days</FormLabel>
              <FormControl>
                <Input
                  placeholder="durationDays of the membership type"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxBorrow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max borrow (Book)</FormLabel>
              <FormControl>
                <Input
                  placeholder="maxBorrow of the membership type"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxReturn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max return (Day)</FormLabel>
              <FormControl>
                <Input
                  placeholder="maxReturn of the membership type"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="price of the membership type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="outline" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default MembershipForm;

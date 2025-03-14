'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { createStaff, updateStaff } from '@/lib/actions/admin/admin.action';
import { useToast } from '@/hooks/use-toast';

interface Props {
  email?: string;
  name?: string;
  id?: string;
  type: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StaffForm = ({ email, name, id = '', type, setIsOpen }: Props) => {
  const { toast } = useToast();

  const formSchema = z.object({
    name: z
      .string()
      .min(3, { message: 'Name must be at least 3 characters' })
      .max(255, { message: 'Name must be max 255 characters' }),
    email: z.string().email({
      message: 'Invalid email input',
    }),

    password:
      type === 'Add'
        ? z
            .string()
            .min(6, { message: 'Password must be at least 6 characters' })
            .max(20, { message: 'Password must be max 20 characters' })
        : z.string().optional(),
    errorField: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name || '',
      email: email || '',
      password: '',
      errorField: '',
    },
  });

  const { isSubmitting, errors } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let response;
    if (type === 'Add') {
      response = await createStaff(values.name, values.email, values.password!);
    } else {
      response = await updateStaff(
        id,
        values.name,
        values.email,
        values.password
      );
    }

    if (!response) {
      return toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
        duration: 2000,
      });
    }

    if (!response.success && response.statusCode !== 201) {
      form.setError('errorField', {
        message: response.message[0].msg,
      });
      return;
    }
    setIsOpen(false);
    toast({
      description: response.message,
      duration: 2000,
    });
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
                <Input placeholder="Name of the staff" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email of the staff"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Password of the staff"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-red-500 font-medium text-sm">
          {errors.errorField?.message}
        </p>
        <Button type="submit" variant="outline" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default StaffForm;

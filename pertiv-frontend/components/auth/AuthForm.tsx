'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { loginAuth } from '@/lib/actions/auth.action';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: 'Invalid email input',
    })
    .email(),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
  errorField: z.string().optional(),
});

const AuthForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      errorField: '',
    },
  });

  const { isSubmitting, errors } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await loginAuth(values.email, values.password);

    if (!response) {
      return toast({
        variant: 'destructive',
        title: 'Oh! Something went wrong!',
        description: 'Internal server error',
      });
    }

    if (!response.success && response.statusCode !== 201) {
      form.setError('errorField', {
        message: response.message,
      });

      return;
    }
    if (response.role === 'admin') return router.push('/admin');
    if (response.role === 'staff') return router.push('/staff');
    if (response.role === 'user') return router.push('/');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="youremail@mail.com"
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
            <FormItem className="space-y-0">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Your password" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-red-500 font-medium text-sm">
          {errors.errorField?.message}
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary-500 hover:bg-primary-600 duration-300"
        >
          Login
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;

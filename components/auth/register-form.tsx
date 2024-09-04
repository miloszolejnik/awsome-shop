'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { AuthCard } from './auth-card';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/app/types/register-schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as zod from 'zod';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { emailRegister } from '@/server/actions/email-register';
import { FormSucces } from './form-succes';
import { FormError } from './form-error';

export const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { execute, status } = useAction(emailRegister, {
    onSuccess(data) {
      console.log(data);
      if (data.data?.error) {
        setError(data.data?.error);
      }
      if (data.data?.success) {
        setSuccess(data.data?.success);
      }
      form.reset();
    },
  });

  const onSubmit = (values: zod.infer<typeof RegisterSchema>) => {
    execute({
      email: values.email,
      password: values.password,
      name: values.name,
    });
  };

  return (
    <AuthCard
      cardTittle="Create an account 🚀"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an acocunt?"
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your username"
                        type="string"
                      />
                    </FormControl>
                    <FormDescription />
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
                        {...field}
                        placeholder="Email"
                        type="email"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription />
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
                        {...field}
                        placeholder="********"
                        type="password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSucces message={success} />
              <FormError message={error} />
              <Button size={'sm'} variant={'link'} asChild>
                <Link href={'/auth/reset'}>Forgot your password?</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn(
                'w-full',
                status === 'executing' ? 'animate-pulse' : ''
              )}
            >
              {'Register'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

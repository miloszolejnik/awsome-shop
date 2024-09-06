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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as zod from 'zod';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FormSucces } from './form-succes';
import { FormError } from './form-error';
import { useSearchParams } from 'next/navigation';
import { NewPasswordSchema } from '@/app/types/new-password-schema';
import { newPassword } from '@/server/actions/new-password';

export const NewPasswordForm = () => {
  const form = useForm<zod.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      token: '',
    },
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { execute, status } = useAction(newPassword, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data?.error);
      }
      if (data.data?.success) {
        setSuccess(data.data?.success);
      }
    },
  });

  const token = useSearchParams().get('token');

  const onSubmit = (values: zod.infer<typeof NewPasswordSchema>) => {
    execute({ token: token, password: values.password });
  };

  return (
    <AuthCard
      cardTittle="Enter the new password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
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
              {'Reset Password'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

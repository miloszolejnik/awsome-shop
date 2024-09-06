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
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FormSucces } from './form-succes';
import { FormError } from './form-error';
import { ResetSchema } from '@/app/types/reset-scheam';
import { reset } from '@/server/actions/password-reset';

export const ResetForm = () => {
  const form = useForm<zod.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { execute, status } = useAction(reset, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data?.error);
      }
      if (data.data?.success) {
        setSuccess(data.data?.success);
      }
    },
  });

  const onSubmit = (values: zod.infer<typeof ResetSchema>) => {
    execute({ email: values.email });
  };

  return (
    <AuthCard
      cardTittle="Forgot your password?"
      backButtonHref="/auth/registration"
      backButtonLabel="Create a new account"
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your email"
                        type="email"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSucces message={success} />
              <FormError message={error} />
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

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import { useForm } from 'react-hook-form';
import { AuthCard } from './auth-card';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/app/types/login-schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as zod from 'zod';
import Link from 'next/link';
import { emailSignIn } from '@/server/actions/email-signin';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FormSucces } from './form-succes';
import { FormError } from './form-error';
import { redirect } from 'next/navigation';

export const LoginForm = () => {
  const form = useForm<zod.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
  });

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [showTwoFactor, setShowToFactor] = useState<boolean>(false);

  const { execute, status } = useAction(emailSignIn, {
    onSuccess(data) {
      if (data.data?.error) {
        setSuccess(undefined);
        setError(data.data?.error);
      }
      if (data.data?.success) {
        setError(undefined);
        setSuccess(data.data?.success);
        redirect('/');
      }
      if (data.data?.twoFactor) {
        setShowToFactor(true);
      }
    },
  });

  const onSubmit = (values: zod.infer<typeof LoginSchema>) => {
    execute({
      email: values.email,
      password: values.password,
      code: values.code,
    });
  };

  return (
    <AuthCard
      cardTittle="Welcome Back!"
      backButtonHref="/auth/registration"
      backButtonLabel="Create a new account"
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Two Factor Code</FormLabel>
                      <FormControl>
                        <InputOTP
                          disabled={status === 'executing'}
                          {...field}
                          maxLength={6}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showTwoFactor && (
                <>
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
                </>
              )}

              <FormSucces message={success} />
              <FormError message={error} />
              <Button
                size={'sm'}
                className="px-0 my-4"
                variant={'link'}
                asChild
              >
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
              {showTwoFactor ? 'Submit' : 'Sign in'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

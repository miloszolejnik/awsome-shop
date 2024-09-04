'use client';

import { newVerification } from '@/server/actions/tokens';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AuthCard } from './auth-card';
import { FormSucces } from './form-succes';
import { FormError } from './form-error';

export const EmailVeryficationForm = () => {
  const token = useSearchParams().get('token');
  const router = useRouter();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVeryfication = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError('token not found');
      return;
    }
    newVerification(token).then((data) => {
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess(data.success);
        router.push('/auth/login');
      }
    });
  }, [success, error, token, router]);

  useEffect(() => {
    handleVeryfication();
  });

  return (
    <AuthCard
      cardTittle="Verify your email"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex justify-center items-center flex-col w-full">
        <p>{!success && !error ? 'Verifying email...' : null}</p>
        <FormSucces message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
};

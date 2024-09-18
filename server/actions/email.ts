'use server';

import getBaseUrl from '@/lib/base-url';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseUrl();

export const sentVeryficationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/verify?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'Awsome Shop - Verify your email',
    html: `<p>Click to <a href="${confirmLink}">verify your email</a></p>`,
  });

  if (error) return error;
  return data;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'Awsome Shop - Reset yout password',
    html: `<p>Click to <a href="${confirmLink}">Rest your password</a></p>`,
  });

  if (error) return error;
  return data;
};

export const sendTwoFactorTokenByEmail = async (
  email: string,
  token: string
) => {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'Awsome Shop - Your Two Factor Token',
    html: `<p>Your Confirmation Code: ${token}</p>`,
  });

  if (error) return error;
  return data;
};

'use server';

import { LoginSchema } from '@/app/types/login-schema';
import { safeActionClient } from '@/lib/safe-action-client';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import { generateEmailVeryficationToken } from './tokens';
import { sentVeryficationEmail } from './email';
import { signIn } from '../auth';
import { AuthError } from 'next-auth';

export const emailSignIn = safeActionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (!existingUser) {
        return { error: 'User not found' };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVeryficationToken(
          existingUser.email!
        );
        await sentVeryficationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: 'verification email sent', error: 'not verified' };
      }

      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      return { success: 'User signed in' };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return { error: 'invalid credentials' };
          default:
            return { error: 'Something went wrong' };
        }
      }

      return { error: 'Unexpected error' };
    }
  });

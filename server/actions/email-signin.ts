'use server';

import { LoginSchema } from '@/app/types/login-schema';
import { safeActionClient } from '@/lib/safe-action-client';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { twoFactorTokens, users } from '../schema';
import {
  generateEmailVeryficationToken,
  generateTwoFactorToken,
  getTwoFactoreCodeByCode,
  getTwoFactoreCodeByEmail,
} from './tokens';
import { sendTwoFactorTokenByEmail, sentVeryficationEmail } from './email';
import { signIn } from '../auth';
import { AuthError } from 'next-auth';

export const emailSignIn = safeActionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
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

      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactoreCodeByEmail(
            existingUser.email
          );
          if (!twoFactorToken) {
            return { error: 'invalid code' };
          }
          if (twoFactorToken.token !== code) {
            return { error: 'invalid code' };
          }

          const hasExpired = new Date() > new Date(twoFactorToken.expires);

          if (hasExpired) return { error: 'token expired' };

          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          const token = await generateTwoFactorToken(existingUser.email);

          if (!token) {
            return { error: 'Something went wrong, please contat us' };
          }
          await sendTwoFactorTokenByEmail(token[0].email, token[0].token);
          return { twoFactor: 'TwoFactor code has been send!' };
        }
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

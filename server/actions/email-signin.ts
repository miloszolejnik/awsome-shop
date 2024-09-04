'use server';

import { LoginSchema } from '@/app/types/login-schema';
import { safeActionClient } from '@/lib/safe-action-client';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';

export const emailSignIn = safeActionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return { error: 'User not found' };
    }

    // if (existingUser.twoFactorEnabled) {
    //   return { error: 'Two factor authentication is enabled' };
    // }

    // if (existingUser.password !== password) {
    //   return { error: 'Incorrect password' };
    // }

    return { success: email };
  });

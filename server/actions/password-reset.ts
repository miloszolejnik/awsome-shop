'use server';

import { ResetSchema } from '@/app/types/reset-scheam';
import { safeActionClient } from '@/lib/safe-action-client';
import { db } from '..';
import { users } from '../schema';
import { eq } from 'drizzle-orm';
import { generatePasswordResetToken } from './tokens';
import { sendPasswordResetEmail } from './email';

export const reset = safeActionClient
  .schema(ResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser || !email) {
      return { error: 'User not found' };
    }

    if (!existingUser.emailVerified) {
      return { error: 'User not verified' };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    if (!passwordResetToken) {
      return { error: 'Failed to generate password reset token' };
    }
    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token
    );
    return { success: 'Password reset email sent' };
  });

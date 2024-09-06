'use server';

import { NewPasswordSchema } from '@/app/types/new-password-schema';
import { safeActionClient } from '@/lib/safe-action-client';
import { db } from '..';
import { getPasswordResetTokenByToken } from './tokens';
import { passwordResetToken, users } from '../schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

export const newPassword = safeActionClient
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
    });
    const dbPool = drizzle(pool);
    // Check if token is valid
    if (!token) {
      return { error: 'Missing token' };
    }

    // Check if token exists
    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
      return { error: 'Token not found' };
    }
    // Check if token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: 'Token expired' };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) {
      return { error: 'User not found' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await dbPool.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, existingUser.id));
      await tx
        .delete(passwordResetToken)
        .where(eq(passwordResetToken.id, existingToken.id));
    });
    return { success: 'Password changed' };
  });

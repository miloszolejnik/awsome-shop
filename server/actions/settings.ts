'use server';

import { SettingsSchema } from '@/app/types/settings-schema';
import { safeActionClient } from '@/lib/safe-action-client';
import { auth } from '../auth';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

export const settings = safeActionClient
  .schema(SettingsSchema)
  .action(async (values) => {
    const user = await auth();
    if (!user) {
      return { error: 'User not found' };
    }
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.user.id),
    });
    if (!dbUser) {
      return { error: 'User not found' };
    }

    if (user.user.isOAuth) {
      values.parsedInput.email = undefined;
      values.parsedInput.password = undefined;
      values.parsedInput.newPassword = undefined;
      values.parsedInput.TwoFactorEnabled = undefined;
    }
    if (
      values.parsedInput.password &&
      values.parsedInput.newPassword &&
      dbUser.password
    ) {
      const passwordMatch = await bcrypt.compare(
        values.parsedInput.password,
        dbUser.password
      );
      if (!passwordMatch) {
        return { error: 'Incorrect password' };
      }
      const samePassword = await bcrypt.compare(
        values.parsedInput.newPassword,
        dbUser.password
      );

      if (samePassword) {
        return { error: 'New password must be different from old password' };
      }

      const hashedPassword = await bcrypt.hash(
        values.parsedInput.newPassword,
        10
      );

      values.parsedInput.password = hashedPassword;
      values.parsedInput.newPassword = undefined;
    }
    await db
      .update(users)
      .set({
        name: values.parsedInput.name,
        email: values.parsedInput.email,
        twoFactorEnabled: values.parsedInput.TwoFactorEnabled,
        image: values.parsedInput.image,
        password: values.parsedInput.password,
      })
      .where(eq(users.id, dbUser.id));
    revalidatePath('/dashboard/settings');
    return { success: 'Settings updated' };
  });

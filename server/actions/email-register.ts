'use server';

import { RegisterSchema } from '@/app/types/register-schema';
import { safeActionClient } from '@/lib/safe-action-client';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import { db } from '..';
import { generateEmailVeryficationToken } from './tokens';
import { sentVeryficationEmail } from './email';

export const emailRegister = safeActionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Check if email is already in use
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    //Check if email is already in use
    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVeryficationToken(email);
        await sentVeryficationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

        return { success: 'verification email resent' };
      }
      return { error: 'Email already in use' };
    }

    //Logic for not registered users
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });
    const verificationToken = await generateEmailVeryficationToken(email);

    await sentVeryficationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );

    return { success: 'Account has been create, and confirmation email sent' };
  });

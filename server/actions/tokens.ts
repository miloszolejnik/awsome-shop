'use server';

import { db } from '..';
import { eq } from 'drizzle-orm';
import { email_verification_token } from '../schema';

export const getEmailVeryficationTokenByEmail = async (email: string) => {
  if (email) {
    try {
      const emailVerificationToken =
        await db.query.email_verification_token.findFirst({
          where: eq(email_verification_token.token, email),
        });
      return emailVerificationToken;
    } catch (error) {
      //   console.log(error);
    }
  }
  return null;
};

export const generateEmailVeryficationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);

  const existingToken = await getEmailVeryficationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(email_verification_token)
      .where(eq(email_verification_token.id, existingToken.id));
  }

  const verificationToken = await db
    .insert(email_verification_token)
    .values({
      email,
      token,
      expires,
    })
    .returning();
  return verificationToken;
};

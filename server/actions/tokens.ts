'use server';

import { db } from '..';
import { eq } from 'drizzle-orm';
import { email_verification_token, passwordResetToken, users } from '../schema';

/**
 * Returns an email verification token, given an email address.
 *
 * If a verification token for the given email address exists, it is returned.
 * If no verification token exists, null is returned.
 *
 * @param {string} email - The email address to search for the verification token.
 * @returns {Promise<email_verification_token | null>}
 */
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

/**
 * Generates a new verification token for a given email address.
 *
 * If a verification token for the given email address already exists, it will be deleted.
 * Then a new verification token is created and returned.
 *
 * @param {string} email - The email address to generate the verification token for.
 * @returns {Promise<email_verification_token>} The newly generated verification token.
 */
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

/**
 * Verifies an email using a verification token.
 *
 * If the token is not found, or has expired, an error is returned.
 * If the corresponding user is not found, an error is returned.
 *
 * If the token is valid, the user's email is verified and the verification token is deleted.
 *
 * @param {string} token - The verification token to use.
 * @returns {Promise<{ success: string } | { error: string }>} The result of the verification.
 */
export const newVerification = async (token: string) => {
  if (token) {
    const existingToken = await getEmailVeryficationTokenByEmail(token);
    if (!existingToken) return { error: 'token not found' };

    const hasExpired = new Date() > new Date(existingToken.expires);
    if (hasExpired) return { error: 'token expired' };

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });
    if (!existingUser) return { error: 'corresponding user not found' };

    await db.update(users).set({
      emailVerified: new Date(),
      email: existingToken.email,
    });
    await db
      .delete(email_verification_token)
      .where(eq(email_verification_token.id, existingToken.id));
    return { success: 'email verified' };
  }
  return { error: 'token has not been passed' };
};

/**
 * Returns a password reset token, given a token.
 *
 * If the token exists, the corresponding password reset token is returned.
 * If no password reset token exists, null is returned.
 *
 * @param {string} token - The token to search for the password reset token.
 * @returns {Promise<passwordResetToken | null>} The password reset token, or null if it does not exist.
 */
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const resetPasswordToken = await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, token),
    });
    return resetPasswordToken;
  } catch {
    return null;
  }
};

/**
 * Returns a password reset token, given an email address.
 *
 * If a password reset token for the given email address exists, it is returned.
 * If no password reset token exists, null is returned.
 *
 * @param {string} email - The email address to search for the password reset token.
 * @returns {Promise<passwordResetToken | null>} The password reset token, or null if it does not exist.
 */
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const resetPasswordToken = await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.email, email),
    });
    return resetPasswordToken;
  } catch {
    return null;
  }
};

/**
 * Generates a new password reset token for a given email address.
 *
 * If a password reset token for the given email address already exists, it is deleted.
 * Then a new password reset token is created and returned.
 *
 * @param {string} email - The email address to generate the password reset token for.
 * @returns {Promise<passwordResetToken>} The newly generated password reset token.
 */
export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getPasswordResetTokenByEmail(token);

    if (existingToken) {
      await db
        .delete(passwordResetToken)
        .where(eq(passwordResetToken.id, existingToken.id));
    }
    const newPasswordResetToken = await db
      .insert(passwordResetToken)
      .values({
        email,
        token,
        expires,
      })
      .returning();
    return newPasswordResetToken;
  } catch {
    return null;
  }
};

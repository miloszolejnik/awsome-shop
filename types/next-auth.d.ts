import NextAuth, { type DefaultSession } from 'next-auth';

export type ExtendedSession = DefaultSession['user'] & {
  id: string;
  role: string;
  twoFactorEnabled: boolean;
  isOAuth: boolean;
  image: string;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedSession;
  }
}

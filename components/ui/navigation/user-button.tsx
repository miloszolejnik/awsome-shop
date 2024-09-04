'use client';

import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';

export const UserButton = ({ user }: Session) => {
  return (
    <div>
      <h1>{user?.name}</h1>
      <h1>{user?.email}</h1>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
};

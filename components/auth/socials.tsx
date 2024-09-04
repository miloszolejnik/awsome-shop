'use clients';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export default function Socials() {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <Button
        variant={'outline'}
        className="flex gap-4 w-full"
        onClick={() =>
          signIn('google', {
            callbackUrl: '/',
            redirect: false,
          })
        }
      >
        <FcGoogle className="w-6 h-6" />
        <span>Sign in with Google</span>
      </Button>
      <Button
        variant={'outline'}
        className="flex gap-4 w-full"
        onClick={() =>
          signIn('github', {
            callbackUrl: '/',
            redirect: false,
          })
        }
      >
        <FaGithub className="w-6 h-6" />
        <span>Sign in with Github</span>
      </Button>
    </div>
  );
}

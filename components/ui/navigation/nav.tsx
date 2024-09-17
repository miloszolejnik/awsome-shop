import { auth } from '@/server/auth';
import { UserButton } from './user-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default async function Nav() {
  const session = await auth();
  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between items-center">
          <li>
            <Link href={'/'} className="flex font-Lobster font-semibold gap-2" aria-label='Home'>
              <h1>Awsome</h1>
              <h1>Shop</h1>
            </Link>
          </li>
          <li>
            {!session?.user ? (
              <Button>
                <Link
                  className="flex gap-2 justify-center align-middle items-center"
                  href={'/auth/login'}
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
              </Button>
            ) : (
              <UserButton expires={session?.expires} user={session?.user} />
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/ui/avatar';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import Image from 'next/image';
import { LogOut, Moon, Settings, Sun, TruckIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

export const UserButton = ({ user }: Session) => {
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState(false);

  function setSwitchTheme() {
    switch (theme) {
      case 'dark':
        return setChecked(true);
      case 'light':
        return setChecked(false);
      case 'system':
        return setChecked(false);
      default:
        return setChecked(false);
    }
  }

  const router = useRouter();
  if (!user) {
    router.push('/');
    return null;
  }
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar
          className="
          justify-center
          items-center"
        >
          {user.image && <AvatarImage src={user.image} alt={user.name!} />}
          {!user.image && (
            <AvatarFallback>
              <div>{user.name?.charAt(0).toUpperCase()}</div>
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-6" align="end">
        <div className="mb-4 p-4 flex flex-col items-center gap-1 rounded-lg bg-primary/10">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name!}
              width={64}
              height={64}
              className="rounded-full"
            />
          )}
          {!user.image && <div>{user.name?.charAt(0).toUpperCase()}</div>}
          <p className="font-bold text-sm">{user.name}</p>
          <span className="text-xs font-medium text-secondary-foreground">
            {user.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/orders')}
          className="group py-2 font-medium cursor-pointer"
        >
          <TruckIcon
            size={14}
            className="mr-2 group-hover:-translate-x-1 transition-all duration-500 ease-in-out"
          />
          My Orders
        </DropdownMenuItem>
        <DropdownMenuItem
          className="group py-2 font-medium cursor-pointer"
          onClick={() => router.push('/dashboard/settings')}
        >
          <Settings
            size={14}
            className="mr-2 group-hover:rotate-180 transition-all duration-300 ease-in-out"
          />
          Settings
        </DropdownMenuItem>
        {theme && (
          <DropdownMenuItem className="py-2 font-medium cursor-pointer">
            <div
              className="flex items-center group gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {theme === 'light' ? (
                <Sun
                  size={14}
                  className="group-hover:text-yellow-600 group-hover:rotate-180 transition-all duration-300 ease-in-out"
                />
              ) : (
                <Moon
                  size={14}
                  className="group-hover:text-blue-400 group-hover:rotate-180 transition-all duration-300 ease-in-out"
                />
              )}
              <p className="dark:text-blue-400 text-secondary-foreground/75 text-yellow-600">
                {theme[0].toUpperCase() + theme.slice(1)} Mode
              </p>
              <Switch
                className="scale-75 ml-2"
                checked={checked}
                onCheckedChange={(e) => {
                  setChecked((prev) => !prev);
                  if (e) setTheme('dark');
                  else setTheme('light');
                }}
              />
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => signOut()}
          className="group hover:bg-destructive/30 py-2 font-medium cursor-pointer"
        >
          <LogOut
            size={14}
            className="mr-2 group-hover:-scale-75 transition-all duration-500 ease-in-out"
          />
          Sing out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

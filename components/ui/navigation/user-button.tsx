'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar } from "@/components/ui/avatar";
import { Session } from 'next-auth';
import { useRouter } from "next/navigation";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export const UserButton = ({ user }: Session) => {
  const router = useRouter();
  if (!user) {
    router.push('/');
    return null
  }
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar
          className="
          justify-center
          items-center">
          {user.image && (
            <AvatarImage
              src={user.image}
              alt={user.name!}
            />
          )}
          {!user.image &&
            <AvatarFallback>
              <div>
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </AvatarFallback>}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-6" align="end">
        <div className="mb-4 p-4 flex flex-col items-center gap-1 rounded-lg bg-primary/10">
          {user.image && (
            <Image src={user.image} alt={user.name!} width={64} height={64} className="rounded-full" />
          )}
          {!user.image &&
            <div>
              {user.name?.charAt(0).toUpperCase()}
            </div>}
          <p className="font-bold text-sm">{user.name}</p>
          <span className="text-xs font-medium text-secondary-foreground">{user.email}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <TruckIcon size={14} className="mr-2 group-hover:-translate-x-1 transition-all duration-500 ease-in-out" />My Orders
        </DropdownMenuItem>
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <Settings size={14} className="mr-2 group-hover:rotate-180 transition-all duration-300 ease-in-out" />Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-500">
          <div className="flex items-center">
            <Sun size={14} />
            <Moon size={14} />
            <p>Theme <span>Theme</span></p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut()}
          className="group hover:bg-destructive/30 py-2 font-medium cursor-pointer transition-all duration-500">
          <LogOut size={14} className="mr-2 group-hover:-scale-75 transition-all duration-500 ease-in-out" />
          Sing out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

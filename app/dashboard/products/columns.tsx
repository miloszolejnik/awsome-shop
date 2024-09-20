'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontalIcon } from 'lucide-react';
import Image from 'next/image';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

type productColumnType = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  variants: any;
};

export const columns: ColumnDef<productColumnType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
      return <div className="font-medium text-xs">{formatted}</div>;
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const cellImg = row.getValue('image') as string;
      const cellTitle = row.getValue('title') as string;
      return (
        <div className="">
          <Image
            src={cellImg}
            width={50}
            height={50}
            alt={cellTitle}
            className="rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'variants',
    header: 'Variants',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} className="p-0 h-8 w-8">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuItem className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer">
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

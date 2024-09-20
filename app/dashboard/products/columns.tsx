'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteProduct } from '@/server/actions/delete-product';
import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontalIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import { toast } from 'sonner';

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

const ActionCell = ({ row }: { row: Row<productColumnType> }) => {
  const { execute, status } = useAction(deleteProduct, {
    onSuccess(data) {
      if (data.data?.success) {
        toast.success(data.data.success);
      }
      if (data.data?.error) {
        toast.error(data.data.error);
      }
    },
    onExecute(data) {
      toast.loading('Deleting product...');
    },
  });
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
        <DropdownMenuItem
          onClick={() => execute({ id: product.id })}
          className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
        >
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
    cell: ActionCell,
  },
];

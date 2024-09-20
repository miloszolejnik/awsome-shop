'use client';

import { ProductsSchema, zodProductSchema } from '@/app/types/product-schema';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DollarSign } from 'lucide-react';
import Tiptap from './tiptap';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { createProduct } from '@/server/actions/create-product';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProductForm() {
  const form = useForm<zodProductSchema>({
    resolver: zodResolver(ProductsSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
    mode: 'onBlur',
  });

  const router = useRouter();

  const { execute, status } = useAction(createProduct, {
    onSuccess: (data) => {
      if (data.data?.success) {
        toast.success(data.data.success);
        router.push('/dashboard/products');
      }
      if (data.data?.error) {
        toast.error(data.data.error);
      }
    },
    onError: (err) => {
      toast.error('Something went terrible wrong!');
    },
    onExecute: (data) => {
      toast.loading('Creating product...');
    },
  });

  async function onSubmit(values: zodProductSchema) {
    await execute(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Exelent Product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <DollarSign
                        size={36}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input
                        {...field}
                        type="number"
                        placeholder="Your price in USD"
                        step="0.01"
                        min={0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={
                status === 'executing' ||
                !form.formState.isValid ||
                form.formState.isDirty
              }
              className="w-full"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

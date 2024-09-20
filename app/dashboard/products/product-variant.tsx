'use client';

import { VariantsWithImagesTags } from '@/lib/infer-type';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { VariantSchema } from '@/app/types/variant-schema';

export default function ProductVariant({
  editMode,
  productId,
  variant,
  children,
}: {
  editMode: boolean;
  productId?: number;
  variant?: VariantsWithImagesTags;
  children: React.ReactNode;
}) {
  const form = useForm<zod.infer<typeof VariantSchema>>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      productId: productId,
      id: undefined,
      productType: 'New AWSOME variant',
      editMode: editMode,
      color: '#000000',
      tags: [],
      variantImages: [],
    },
  });

  function onSubmit(values: zod.infer<typeof VariantSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger className="flex gap-2 items-center">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editMode ? 'Edit' : 'Create'} your variant</DialogTitle>
          <DialogDescription>
            Manage your product variants here. You can add tahs, images, and
            more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pick a title for your variant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Tags</FormLabel>
                  <FormControl>{/* <InputTags /> */}</FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <VariantImages /> */}
            {editMode && variant && (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Delete Variant
              </Button>
            )}
            <Button type="submit">
              {editMode ? 'Update Variant' : 'Create Variant'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

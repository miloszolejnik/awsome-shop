import * as zod from 'zod';

export const ProductsSchema = zod.object({
  id: zod.number().optional(),
  title: zod.string().min(5, {
    message: 'Title must be at least 5 characters long',
  }),
  description: zod.string().min(10, {
    message: 'Description must be at least 10 characters long',
  }),
  price: zod.coerce
    .number({
      invalid_type_error: 'Price must be a number',
    })
    .positive({
      message: 'Price must be a positive number',
    })
    .min(1, {
      message: 'Price must be at least 1',
    }),
});

export type zodProductSchema = zod.infer<typeof ProductsSchema>;

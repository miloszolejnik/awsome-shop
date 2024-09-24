import { variantImages } from '@/server/schema';
import * as zod from 'zod';

export const VariantSchema = zod.object({
  productId: zod.number(),
  id: zod.number(),
  editMode: zod.boolean(),
  productType: zod.string().min(3, {
    message: 'Product type must be at least 3 characters long',
  }),
  color: zod.string().min(3, {
    message: 'Color must be at least 3 characters long',
  }),
  tags: zod.array(
    zod.string().min(1, {
      message: 'Please enter at least 1 tag',
    })
  ),
  variantImages: zod.array(
    zod.object({
      url: zod.string().refine((url) => {
        url.search('blob:') !== 0,
          { message: 'PLease wait for the image to upload' };
      }),
      size: zod.number(),
      key: zod.string().optional(),
      id: zod.number().optional(),
      name: zod.string(),
    })
  ),
});

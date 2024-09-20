'use server';

import { safeActionClient } from '@/lib/safe-action-client';
import * as zod from 'zod';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { products } from '../schema';
import { revalidatePath } from 'next/cache';
import { stringifyError } from 'next/dist/shared/lib/utils';

const action = safeActionClient;

export const deleteProduct = action
  .schema(zod.object({ id: zod.number() }))
  .action(async ({ parsedInput }) => {
    try {
      const data = await db
        .delete(products)
        .where(eq(products.id, parsedInput.id))
        .returning();
      revalidatePath('/dashboard/products', 'page');
      return {
        success: `Product ${data[0].title} has been deleted`,
        data: data,
      };
    } catch (err: Error | any) {
      return { error: stringifyError(err) };
    }
  });

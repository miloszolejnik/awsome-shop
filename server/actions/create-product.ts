'use server';

import { ProductsSchema } from '@/app/types/product-schema';
import { safeActionClient } from '@/lib/safe-action-client';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { products } from '../schema';

export const createProduct = safeActionClient
  .schema(ProductsSchema)
  .action(async (data) => {
    try {
      if (data.parsedInput.id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, data.parsedInput.id),
        });
        if (!currentProduct) {
          return { error: 'Product not found' };
        }
        const newProduct = await db
          .update(products)
          .set({
            description: data.parsedInput.description,
            title: data.parsedInput.title,
            price: data.parsedInput.price,
          })
          .where(eq(products.id, data.parsedInput.id))
          .returning();
        return {
          success: `Product ${newProduct[0].title} has been updated`,
        };
      }
      if (!data.parsedInput.id) {
        await db.insert(products).values({
          description: data.parsedInput.description,
          title: data.parsedInput.title,
          price: data.parsedInput.price,
        });
        return {
          success: `Product ${data.parsedInput.title} has been created`,
        };
      }
    } catch (err) {
      return { error: JSON.stringify(err) };
    }
    return;
  });

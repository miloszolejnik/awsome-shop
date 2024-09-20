import { createId } from '@paralleldrive/cuid2';
import { time } from 'console';
import { relations } from 'drizzle-orm';
import {
  pgTable,
  timestamp,
  integer,
  text,
  primaryKey,
  boolean,
  pgEnum,
  serial,
  real,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';
import { title } from 'process';

export const RoleEnum = pgEnum('roles', ['user', 'admin']);

export const users = pgTable('user', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  password: text('password').notNull(),
  image: text('image'),
  twoFactorEnabled: boolean('twoFactorEnabled').default(false),
  role: RoleEnum('roles').default('user'),
  created: timestamp('created', { mode: 'date' }).defaultNow(),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const email_verification_token = pgTable(
  'email_verification_token',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);

export const passwordResetToken = pgTable(
  'password_reset_token',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);

export const twoFactorTokens = pgTable(
  'two_factor_tokens',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
    userId: text('userId').references(() => users.id, { onDelete: 'cascade' }),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  created: timestamp('creted', { mode: 'date' }).defaultNow(),
});

export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  color: text('color').notNull(),
  productType: text('productType').notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow(),
  productId: serial('productId')
    .notNull()
    .references(() => products.id, {
      onDelete: 'cascade',
    }),
});

export const variantImages = pgTable('variant_images', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  size: real('size').notNull(),
  name: text('name').notNull(),
  order: real('order').notNull(),
  productId: serial('productId')
    .notNull()
    .references(() => productVariants.id, {
      onDelete: 'cascade',
    }),
});

export const variantTags = pgTable('tags', {
  id: serial('id').primaryKey(),
  tag: text('tag').notNull(),
  variantId: serial('productId')
    .notNull()
    .references(() => productVariants.id, {
      onDelete: 'cascade',
    }),
});

export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: 'productVariants' }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
      relationName: 'productVariants',
    }),
    variantImages: many(variantImages, { relationName: 'variantImages' }),
    variantTags: many(variantTags, { relationName: 'variantTags' }),
  })
);

export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  productVariant: one(productVariants, {
    relationName: 'productVariant',
    fields: [variantImages.productId],
    references: [productVariants.id],
  }),
}));

export const variantTagsRelations = relations(variantTags, ({ one }) => ({
  productVariant: one(productVariants, {
    relationName: 'variantTags',
    fields: [variantTags.variantId],
    references: [productVariants.id],
  }),
}));

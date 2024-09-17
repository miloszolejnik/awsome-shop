import * as zod from 'zod';

export const SettingsSchema = zod
  .object({
    name: zod.optional(
      zod.string().min(3, 'Name must be at least 3 characters long')
    ),
    image: zod.optional(zod.string().url()),
    TwoFactorEnabled: zod.optional(zod.boolean()),
    email: zod.optional(zod.string().email()),
    password: zod.optional(zod.string().min(8)),
    newPassword: zod.optional(zod.string().min(8)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    { message: 'New password is required', path: ['newPassword'] }
  );

import * as zod from 'zod';

export const NewPasswordSchema = zod.object({
  password: zod.string().min(8, 'Password must be at least 8 characters long'),
  token: zod.string().nullable().optional(),
});

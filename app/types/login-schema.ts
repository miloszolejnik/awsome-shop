import * as zod from 'zod';

export const LoginSchema = zod.object({
  email: zod.string().email({
    message: 'Invalid email address',
  }),
  password: zod.string().min(1, {
    message: 'Password is required',
  }),
  code: zod.optional(zod.string()),
});

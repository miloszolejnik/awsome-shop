import * as zod from 'zod';

export const RegisterSchema = zod.object({
  email: zod.string().email({
    message: 'Invalid email address',
  }),
  password: zod.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
  name: zod
    .string()
    .min(3, {
      message: 'Name must be at least 3 characters long',
    })
    .max(20, {
      message: 'Name must be at most 20 characters long',
    }),
});

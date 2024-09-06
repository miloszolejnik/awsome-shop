import * as zod from 'zod';

export const ResetSchema = zod.object({
  email: zod.string().email({
    message: 'Email is required',
  }),
});

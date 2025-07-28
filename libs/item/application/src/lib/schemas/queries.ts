import z from 'zod';

export const getUserInventoryInputSchema = z.object({
  userId: z.string(),
});

export type GetUserInventoryInput = z.infer<typeof getUserInventoryInputSchema>;

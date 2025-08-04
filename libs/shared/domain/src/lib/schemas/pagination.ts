import { z } from 'zod';

export const paginationOutputSchema = <T>(itemSchema: z.ZodType<T>) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    currentPage: z.number(),
    lastPage: z.number(),
    perPage: z.number(),
  });

export type PaginationOutput<Item> = z.infer<
  ReturnType<typeof paginationOutputSchema<Item>>
>;

import { z } from "zod";

export const infiniteQueryPaginationPropsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(10),
  cursor: z.string().optional(),
});

export const infinitePaginationOutputSchema = <T>(itemSchema: z.ZodType<T>) =>
  z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().optional(),
  });

export interface InfinitePaginationOutput<T> {
  items: T[];
  nextCursor: string | undefined;
}

export type InfinityQueryPaginationProps = z.output<
  typeof infiniteQueryPaginationPropsSchema
>;

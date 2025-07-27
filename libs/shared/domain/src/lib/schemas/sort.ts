import { z } from 'zod';

export const sortDirectionSchema = z.enum(['asc', 'desc']);

export const searchResultPropsSchema = <T, Filter = string>({
  filterSchema,
  itemSchema,
}: {
  itemSchema: z.ZodType<T>;
  filterSchema?: z.ZodType<Filter>;
}) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    currentPage: z.number(),
    perPage: z.number(),
    sort: z.string().nullable(),
    sortDir: z.string().nullable(),
    filter: (filterSchema ? filterSchema : z.string()).nullable(),
  });

export type SortDirection = z.infer<typeof sortDirectionSchema>;

export type SearchResultProps<E = object, Filter = string> = z.infer<
  ReturnType<typeof searchResultPropsSchema<E, Filter>>
>;

import type { ZodSchema } from 'zod';
import { z } from 'zod';

import { sortDirectionSchema } from './sort';

export const searchParamsPropsSchema = <
  T extends ZodSchema | undefined = undefined,
>({
  filterSchema,
}: {
  filterSchema?: T;
} = {}) =>
  z.object({
    page: z.number().optional(),
    perPage: z.number().optional(),
    sort: z.string().optional().nullable(),
    sortDir: sortDirectionSchema.optional().nullable(),
    filter: (filterSchema ?? z.string()).optional().nullable(),
  });

type PreParsed = z.infer<ReturnType<typeof searchParamsPropsSchema>>;

export type SearchParamsProps<Filter = string> = Omit<PreParsed, 'filter'> & {
  filter?: Filter | null;
};

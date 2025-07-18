import { z } from "zod";

export const sortDirectionSchema = z.enum(["asc", "desc"]);

export const searchResultPropsSchema = <
  U extends string,
  T extends Readonly<[U, ...U[]]>,
>({
  filterSchema,
  itemSchema,
}: {
  itemSchema: z.AnyZodObject;
  filterSchema: T;
}) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    currentPage: z.number(),
    perPage: z.number(),
    sort: z.string().nullable(),
    sortDir: z.string().nullable(),
    filter: (filterSchema ? z.enum(filterSchema) : z.string())
      .optional()
      .nullable(),
  });

export type SortDirection = z.infer<typeof sortDirectionSchema>;

export type SearchResultProps<E = object, Filter = string> = Omit<
  z.infer<ReturnType<typeof searchResultPropsSchema>>,
  "items"
> & {
  items: E[];
  filter?: Filter | null;
};

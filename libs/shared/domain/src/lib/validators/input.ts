import { z } from "zod";

export const findByIdSchema = z.object({
  id: z.string(),
});

export type FindById = z.infer<typeof findByIdSchema>;

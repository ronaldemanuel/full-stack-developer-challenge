import { z } from 'zod';

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  logo: z.string().nullish(),
  metadata: z.record(z.any()).nullish(),
});

export type Organization = z.infer<typeof organizationSchema>;

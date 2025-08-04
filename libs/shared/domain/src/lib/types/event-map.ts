import type { z } from 'zod';

export type EventMap = Record<
  string,
  {
    data: z.AnyZodObject;
  }
>;

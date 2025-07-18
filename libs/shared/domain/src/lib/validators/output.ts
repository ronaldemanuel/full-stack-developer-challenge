import { z } from "zod";

export const successOutputSchema = z.object({ success: z.boolean() });

export const successWithMessageOutputSchema = successOutputSchema.extend({
  message: z.string(),
});

export type SuccessOutputSchema = z.infer<typeof successOutputSchema>;
export type SuccessWithMessageOutputSchema = z.infer<
  typeof successWithMessageOutputSchema
>;

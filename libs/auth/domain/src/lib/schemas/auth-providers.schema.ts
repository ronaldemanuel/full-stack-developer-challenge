import z from 'zod';

export const authProvidersSchema = z.enum(['google', 'apple', 'credentials']);
export type AuthProviders = z.infer<typeof authProvidersSchema>;

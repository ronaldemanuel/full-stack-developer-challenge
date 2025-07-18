import { z } from 'zod';

export const emailTypesSchema = z.enum([
  'sendVerificationEmail',
  'sendResetPassword',
  'sendMagicLink',
  'sendVerificationOTP',
]);

export const sendVerificationEmailPayloadSchema = z.object({
  user: z.object({
    name: z.string(),
    email: z.string(),
  }),
  url: z.string(),
  token: z.string(),
});

export const sendResetPasswordPayloadSchema =
  sendVerificationEmailPayloadSchema;

export const sendMagicLinkPayloadSchema = sendVerificationEmailPayloadSchema;

export const sendVerificationOTPPayloadSchema = z.object({
  email: z.string(),
  otp: z.string(),
  type: z.literal('sign-in'),
  // type: z.enum(['sign-in', 'email-verification', 'forget-password']),
});

export const sendEmailAbstractPayloadSchema = z.object({
  subject: z.string(),
  to: z.string(),
  body: z.string(),
});

export type EmailTypes = z.infer<typeof emailTypesSchema>;

export type SendVerificationEmailPayload = z.infer<
  typeof sendVerificationEmailPayloadSchema
>;
export type SendResetPasswordPayload = z.infer<
  typeof sendResetPasswordPayloadSchema
>;
export type SendMagicLinkPayload = z.infer<typeof sendMagicLinkPayloadSchema>;
export type SendVerificationOTPPayload = z.infer<
  typeof sendVerificationOTPPayloadSchema
>;

export type SendEmailAbstractPayload = z.infer<
  typeof sendEmailAbstractPayloadSchema
>;

export type SendEmailPayload<T extends EmailTypes> = SendEmailAbstractPayload &
  T extends 'sendVerificationEmail'
  ? {
      data: SendVerificationEmailPayload;
    }
  : T extends 'sendResetPassword'
  ? {
      data: SendResetPasswordPayload;
    }
  : T extends 'sendMagicLink'
  ? {
      data: SendMagicLinkPayload;
    }
  : T extends 'sendVerificationOTP'
  ? {
      data: SendVerificationOTPPayload;
    }
  : never;

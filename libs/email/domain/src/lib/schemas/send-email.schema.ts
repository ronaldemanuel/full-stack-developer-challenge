import { z } from 'zod';

export const emailTypesSchema = z.enum([
  'sendVerificationEmail',
  'sendResetPassword',
  'sendMagicLink',
  'sendVerificationOTP',
  'sendInvitationEmail',
]);

const sendInvitationEmailPayloadSchema = z.object({
  email: z.string(),
  username: z.string().optional(),
  invitedByUsername: z.string().optional(),
  invitedByEmail: z.string().optional(),
  teamName: z.string().optional(),
  teamImage: z.string().optional(),
  inviteLink: z.string().optional(),
});

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
  to: z.string(),
});

export const renderEmailResponseSchema = z.object({
  html: z.string(),
  text: z.string(),
});

export type RenderEmailResponse = z.infer<typeof renderEmailResponseSchema>;

export type EmailTypes = z.infer<typeof emailTypesSchema>;

export type SendInvitationEmailPayload = z.infer<
  typeof sendInvitationEmailPayloadSchema
>;

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

export interface SendEmailPayload<T extends EmailTypes>
  extends SendEmailAbstractPayload {
  data: T extends 'sendVerificationEmail'
    ? SendVerificationEmailPayload
    : T extends 'sendResetPassword'
    ? SendResetPasswordPayload
    : T extends 'sendMagicLink'
    ? SendMagicLinkPayload
    : T extends 'sendVerificationOTP'
    ? SendVerificationOTPPayload
    : T extends 'sendInvitationEmail'
    ? SendInvitationEmailPayload
    : object;
}

export type SendEmailPayloadData<T extends EmailTypes> =
  SendEmailPayload<T>['data'];

import type { FactoryProvider } from '@nestjs/common';
import type { Adapter } from 'better-auth';
import { expo } from '@better-auth/expo';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import {
  admin,
  magicLink,
  multiSession,
  oAuthProxy,
  oneTap,
  organization,
  twoFactor,
} from 'better-auth/plugins';

import {
  SendInvitationEmailUseCase,
  SendMagicLinkUseCase,
  SendOTPEmailUseCase,
  SendResetPasswordUseCase,
  SendVerificationEmailUseCase,
} from '@nx-ddd/auth-application';

import { BETTER_AUTH_DATABASE_ADAPTER_TOKEN } from './better-auth-database-adapter.factory';

export const BETTER_AUTH_TOKEN = 'BETTER_AUTH';
export const BETTER_AUTH_CONFIG_TOKEN = 'BETTER_AUTH_CONFIG';

export interface BetterAuthConfig {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
  googleClientId: string | undefined;
  googleClientSecret: string | undefined;
  githubClientId: string | undefined;
  githubClientSecret: string | undefined;
  allowedOrigins: string[];
}

export function initAuth(
  config: BetterAuthConfig,
  adapter: Adapter,
  sendVerificationEmailUseCase: SendVerificationEmailUseCase.UseCase,
  sendResetPasswordUseCase: SendResetPasswordUseCase.UseCase,
  sendMagicLinkEmailUseCase: SendMagicLinkUseCase.UseCase,
  sendInvitationEmailUseCase: SendInvitationEmailUseCase.UseCase,
  sendOTPEmailUseCase: SendOTPEmailUseCase.UseCase,
): ReturnType<typeof betterAuth> {
  return betterAuth({
    baseURL: config.baseUrl,
    appName: 'Better Auth',
    database: adapter,
    emailVerification: {
      async sendVerificationEmail({ user, url, token }) {
        return sendVerificationEmailUseCase.execute({
          user: {
            name: user.name,
            email: user.email,
          },
          url,
          token,
        });
      },
    },
    account: {
      accountLinking: {
        trustedProviders: ['google', 'github', 'demo-app'],
      },
    },
    emailAndPassword: {
      enabled: true,
      async sendResetPassword({ user, url, token }) {
        return sendResetPasswordUseCase.execute({
          user: {
            name: user.name,
            email: user.email,
          },
          url,
          token,
        });
      },
      requireEmailVerification: true,
    },
    socialProviders: {
      google: {
        clientId: config.googleClientId || '',
        clientSecret: config.googleClientSecret || '',
        enabled: config.googleClientId ? true : false,
      },
      // github: {
      //   clientId: config.githubClientId || '',
      //   clientSecret: config.githubClientSecret || '',
      //   enabled: config.githubClientId ? true : false,
      // },
    },
    plugins: [
      expo(),
      organization({
        async sendInvitationEmail(data) {
          await sendInvitationEmailUseCase.execute({
            email: data.email,
            username: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink: `${config.baseUrl}/accept-invitation/${data.id}`,
          });
        },
      }),
      twoFactor({
        otpOptions: {
          async sendOTP({ user, otp }) {
            await sendOTPEmailUseCase.execute({
              email: user.email,
              otp,
            });
          },
        },
      }),
      magicLink({
        async sendMagicLink({ email, token, url }) {
          return sendMagicLinkEmailUseCase.execute({
            user: {
              name: email,
              email,
            },
            url,
            token,
          });
        },
      }),
      multiSession(),
      oneTap(),
      oAuthProxy({
        currentURL: config.baseUrl,
        productionURL: config.productionUrl,
      }),
      admin({
        // cspell:disable-next-line
        adminUserIds: ['EXD5zjob2SD6CBWcEQ6OpLRHcyoUbnaB'],
      }),
      nextCookies(),
    ],
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
      },
    },
    trustedOrigins: config.allowedOrigins,
  });
}

export type BetterAuth = ReturnType<
  typeof betterAuth<{
    plugins: [
      ReturnType<typeof organization<object>>,
      ReturnType<typeof multiSession>,
    ];
  }>
>;

export const BetterAuthFactory: FactoryProvider = {
  provide: BETTER_AUTH_TOKEN,
  useFactory: (
    config: BetterAuthConfig,
    adapter: Adapter,
    sendVerificationEmailUseCase: SendVerificationEmailUseCase.UseCase,
    sendResetPasswordUseCase: SendResetPasswordUseCase.UseCase,
    sendMagicLinkEmailUseCase: SendMagicLinkUseCase.UseCase,
    sendInvitationEmailUseCase: SendInvitationEmailUseCase.UseCase,
    sendOTPEmailUseCase: SendOTPEmailUseCase.UseCase,
  ) => {
    return initAuth(
      config,
      adapter,
      sendVerificationEmailUseCase,
      sendResetPasswordUseCase,
      sendMagicLinkEmailUseCase,
      sendInvitationEmailUseCase,
      sendOTPEmailUseCase,
    );
  },
  inject: [
    BETTER_AUTH_CONFIG_TOKEN,
    BETTER_AUTH_DATABASE_ADAPTER_TOKEN,
    SendVerificationEmailUseCase.UseCase,
    SendResetPasswordUseCase.UseCase,
    SendMagicLinkUseCase.UseCase,
    SendInvitationEmailUseCase.UseCase,
    SendOTPEmailUseCase.UseCase,
  ],
};

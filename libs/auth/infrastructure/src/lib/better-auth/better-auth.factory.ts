import { FactoryProvider } from '@nestjs/common';
import { type Adapter, betterAuth } from 'better-auth';
import { BETTER_AUTH_DATABASE_ADAPTER_TOKEN } from './better-auth-database-adapter.factory.js';
import { emailOTP } from 'better-auth/plugins';

export const BETTER_AUTH_TOKEN = 'BETTER_AUTH';
export const BETTER_AUTH_CONFIG_TOKEN = 'BETTER_AUTH_CONFIG';

export interface BetterAuthConfig {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
}

export const BetterAuthFactory: FactoryProvider = {
  provide: BETTER_AUTH_TOKEN,
  useFactory: (config: BetterAuthConfig, adapter: Adapter) => {
    return betterAuth({
      appName: 'Better Auth',
      // TODO: inject the adapter
      database: adapter,
      emailVerification: {
        async sendVerificationEmail({ user, url }) {
          // TODO: use a email provider
        },
      },
      account: {
        accountLinking: {
          trustedProviders: ['google', 'github', 'demo-app'],
        },
      },
      emailAndPassword: {
        enabled: true,
        async sendResetPassword({ user, url }) {
          // TODO: use a email provider
        },
      },
      plugins: [
        emailOTP({
          async sendVerificationOTP({ email, otp, type }) {
            // Implement the sendVerificationOTP method to send the OTP to the user's email address
          },
        }),
      ],
    });
  },
  inject: [BETTER_AUTH_CONFIG_TOKEN, BETTER_AUTH_DATABASE_ADAPTER_TOKEN],
};

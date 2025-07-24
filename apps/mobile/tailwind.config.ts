import type { Config } from 'tailwindcss';
// @ts-expect-error - no types
import nativewind from 'nativewind/preset';

import { native as baseConfig } from '@nx-ddd/tailwind';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [baseConfig, nativewind],
} satisfies Config;

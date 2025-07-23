import type { Config } from 'tailwindcss';

import { base } from './base.js';

export const native = {
  content: base.content,
  presets: [base],
  theme: {},
} satisfies Config;

import type { TOptionsFromAdapter } from '@nestjs-cls/transactional/dist/src/lib/interfaces.js';
import {
  Transactional as OriginalTransactional,
  Propagation,
} from '@nestjs-cls/transactional';

import { DATABASE_CONNECTION_NAME } from '../constants/index.js';

export function Transactional<T>(
  propagation?: Propagation,
  options?: TOptionsFromAdapter<T>,
) {
  return OriginalTransactional<T>(
    DATABASE_CONNECTION_NAME,
    propagation ?? Propagation.Required,
    options,
  );
}

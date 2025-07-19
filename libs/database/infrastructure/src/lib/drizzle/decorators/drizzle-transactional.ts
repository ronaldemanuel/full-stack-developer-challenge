import { Propagation, Transactional } from '@nestjs-cls/transactional';

import type { DrizzleTransactionalAdapter } from '../types/drizzle.js';
import { DRIZZLE_CONNECTION_NAME } from '../constants/index.js';

type TransactionalDrizzleParams = Parameters<
  typeof Transactional<DrizzleTransactionalAdapter>
>;

type Options = TransactionalDrizzleParams['2'];

type TransactionalDrizzleReturnType = ReturnType<
  typeof Transactional<DrizzleTransactionalAdapter>
>;

export function TransactionalDrizzle(
  propagation?: Propagation
): TransactionalDrizzleReturnType;
export function TransactionalDrizzle(
  propagation: Propagation,
  options?: Options
): TransactionalDrizzleReturnType;
export function TransactionalDrizzle(
  propagation?: Propagation,
  options?: Options
) {
  return Transactional<DrizzleTransactionalAdapter>(
    DRIZZLE_CONNECTION_NAME,
    propagation ?? Propagation.Required,
    options
  );
}

import type { Transaction } from '@nestjs-cls/transactional';
import type { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import type { DrizzleDB } from '../client';

export type DrizzleTransactionalAdapter =
  TransactionalAdapterDrizzleOrm<DrizzleDB>;

export type DrizzleTX = Transaction<DrizzleTransactionalAdapter>;

import type { z } from 'zod';

export enum EventQueues {
  APP_QUEUE = 'app-queue',
}

export enum EventTypes {
  SEND_EMAIL = `${EventQueues.APP_QUEUE}/send-email`,
}

export type EventMap = Record<
  EventTypes,
  {
    data: z.AnyZodObject;
  }
>;

import type { z } from 'zod';

export enum EventTypes {
  SEND_EMAIL = 'app-queue/send-email',
}

export type EventMap = Record<
  EventTypes,
  {
    data: z.AnyZodObject;
  }
>;

import z from 'zod';

import type { EventMap } from '../types/event-map';

const sendEmailPayloadSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
});

export const eventsMap = {
  'app-queue/send-email': {
    data: sendEmailPayloadSchema,
  },
  'app-queue/post-created': {
    data: z.object({
      id: z.string(),
      title: z.string().min(5).max(255),
      content: z.string().optional(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  },
} satisfies EventMap;

export type EventsMap = typeof eventsMap;

import z from 'zod';
import type { EventMap } from '../types/event-map.js';

const sendEmailPayloadSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
});

export const eventsMap = {
  'app-queue/send-email': {
    data: sendEmailPayloadSchema,
  },
} satisfies EventMap;

export type EventTypes = keyof typeof eventsMap;

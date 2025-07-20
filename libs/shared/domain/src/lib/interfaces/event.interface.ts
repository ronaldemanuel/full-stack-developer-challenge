import type { IEvent as PrimitiveEvent } from '@nestjs/cqrs';
import type { EventTypes } from '../constants/event-map.js';

export interface IEvent extends PrimitiveEvent {
  get identifier(): EventTypes;
}

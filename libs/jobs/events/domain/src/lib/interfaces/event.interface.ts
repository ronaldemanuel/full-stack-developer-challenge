import type { IEvent as PrimitiveEvent } from '@nestjs/cqrs';
import type { EventTypes } from '../types/event-map';

export interface IEvent extends PrimitiveEvent {
  get identifier(): EventTypes;
}

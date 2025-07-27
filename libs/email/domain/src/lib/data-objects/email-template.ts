import type {
  EmailTypes,
  RenderEmailResponse,
  SendEmailPayloadData,
} from '../schemas/send-email.schema';

export abstract class AbstractEmailTemplate<K extends EmailTypes> {
  abstract render(data: SendEmailPayloadData<K>): Promise<RenderEmailResponse>;
  abstract get subject(): string;
}

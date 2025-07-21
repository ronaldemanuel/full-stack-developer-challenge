import { firstValueFrom, ReplaySubject } from 'rxjs';
import type { SqsStrategy } from '@nx-ddd/job-events-infra';
import { bootstrapSqs } from '@nx-ddd/job-events-infra';
import type { Context, Handler, SQSEvent } from 'aws-lambda';

const strategySubject = new ReplaySubject<SqsStrategy>();

export const lambdaHandler: Handler = async (
  event: SQSEvent,
  context: Context
) => {
  bootstrapSqs()
    .then((strategy) => strategySubject.next(strategy))
    .catch((error) => {
      console.error('Error bootstrapping SQS strategy:', error);
    });
  const strategy = await firstValueFrom(strategySubject);

  for (const record of event.Records) {
    const message = JSON.parse(record.body);
    if (!message.pattern) {
      continue;
    }
    const handler = strategy.getHandlerByPattern(message.pattern);
    if (!handler) {
      return;
    }
    const msContext = {
      ...message.event.ctx,
      providerCtx: context,
    };
    await handler(message.event.data, msContext);
  }
};

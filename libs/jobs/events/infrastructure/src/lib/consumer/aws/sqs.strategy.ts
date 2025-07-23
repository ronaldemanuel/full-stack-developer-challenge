//sns-strategy.ts
import type { CustomTransportStrategy } from '@nestjs/microservices';
import { Server } from '@nestjs/microservices';

export class SqsStrategy extends Server implements CustomTransportStrategy {
  override on<
    EventKey extends string = string,
    EventCallback extends Function = Function,
  >(event: EventKey, callback: EventCallback) {
    this.logger.log(`on event: ${event}`);
  }

  override unwrap<T>(): T {
    return {} as T;
  }
  /**
   * This method is triggered when you run "app.listen()".
   */
  async listen(callback: () => void) {
    this.logger.log('listen');
    callback();
  }

  /**
   * This method is triggered on application shutdown.
   */
  close() {
    this.logger.log('close');
  }
}

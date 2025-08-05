import type { Inngest } from 'inngest';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { Inject, Injectable } from '@nestjs/common';
import { INNGEST_FUNCTION, INNGEST_KEY, INNGEST_TRIGGER } from 'nest-inngest';

@Injectable()
export class ServerlessInngestService {
  constructor(
    @Inject(DiscoveryService) private readonly discover: DiscoveryService,
    @Inject(INNGEST_KEY) private readonly inngest: Inngest,
  ) {}

  public async getHandlers() {
    const [functions, triggers] = await Promise.all([
      Promise.all([
        this.discover.controllerMethodsWithMetaAtKey(INNGEST_FUNCTION),
        this.discover.providerMethodsWithMetaAtKey(INNGEST_FUNCTION),
      ]),
      Promise.all([
        this.discover.controllerMethodsWithMetaAtKey(INNGEST_TRIGGER),
        this.discover.providerMethodsWithMetaAtKey(INNGEST_TRIGGER),
      ]),
    ]);

    const handlers = functions.flat().map((func) => {
      const trigger = triggers
        .flat()
        .find(
          (each) =>
            each.discoveredMethod.handler == func.discoveredMethod.handler,
        );

      return this.inngest.createFunction(
        // @ts-ignore
        func.meta,
        trigger?.meta,
        func.discoveredMethod.handler.bind(
          func.discoveredMethod.parentClass.instance,
        ),
      );
    });
    return handlers;
  }
}

import type { InngestModuleOptions } from 'nest-inngest';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { INNGEST_KEY, INNGEST_OPTIONS, InngestModule } from 'nest-inngest';

import { ServerlessInngestService } from './serverless-inngest.service';

export class ServerlessInngestModule extends InngestModule {
  static override forRoot({ inngest, ...options }: InngestModuleOptions) {
    return {
      imports: [DiscoveryModule],
      module: InngestModule,
      providers: [
        {
          provide: INNGEST_KEY,
          useValue: inngest,
        },
        {
          provide: INNGEST_OPTIONS,
          useValue: options,
        },
        ServerlessInngestService,
      ],
      exports: [ServerlessInngestService],
      global: true,
    } as any;
  }

  override async configure(): Promise<void> {
    //
  }
}

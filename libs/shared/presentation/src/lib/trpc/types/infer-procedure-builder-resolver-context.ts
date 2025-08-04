import type {
  AnyProcedureBuilder,
  inferProcedureBuilderResolverOptions,
} from '@trpc/server/unstable-core-do-not-import';

export type inferProcedureBuilderResolverContext<
  Procedure extends AnyProcedureBuilder,
> = Omit<inferProcedureBuilderResolverOptions<Procedure>['ctx'], 'appContext'>;

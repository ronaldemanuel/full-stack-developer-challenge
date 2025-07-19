import type { Type } from '@nestjs/common';
import type { AnyZodObject } from 'zod';
import { z } from 'zod';
import {
  paginationOutputSchema,
  searchParamsPropsSchema,
} from '@nx-ddd/shared-domain';
import { protectedProcedure } from '../procedures.js';
import { createNestjsTrpcRouter } from './create-nestjs-trpc-router.js';

type ControllerMethodKeys =
  | 'create'
  | 'findById'
  | 'findAll'
  | 'update'
  | 'delete'
  | 'search';

export function createNestjsTrpcCrudRouter<
  AllowedMethods extends readonly ControllerMethodKeys[],
  T extends Type<Type<Record<AllowedMethods[number], Function>>>,
  E extends AnyZodObject,
  C extends AnyZodObject,
  U extends AnyZodObject = C
>(
  controller: T extends Type<Record<AllowedMethods[number], Function>>
    ? T
    : Type<Record<AllowedMethods[number], Function>>,
  entitySchema: E,
  createInputSchema: C,
  updateInputSchema: U = createInputSchema as unknown as U,
  prefix: `/${string}` = '/',
  tags: string[] = ([] = [controller.name]),
  allowedMethods?: AllowedMethods
) {
  return createNestjsTrpcRouter(controller, (resolver) => {
    const _allowedMethods =
      allowedMethods ??
      ([
        'create',
        'findById',
        'findAll',
        'update',
        'delete',
        'search',
      ] as const);
    const createProcedure = protectedProcedure
      .input(createInputSchema)
      .output(entitySchema)
      .meta({
        openapi: {
          method: 'POST',
          path: `${prefix}/create`,
          tags,
        },
      })
      // @ts-expect-error // The adaptMethod function should be able to handle the input shape
      .mutation(resolver.adaptMethod('create'));
    const findByIdProcedure = protectedProcedure
      .input(z.object({ id: entitySchema.shape.id }))
      .output(entitySchema)
      .meta({
        openapi: {
          method: 'GET',
          path: `${prefix}/:id`,
          tags,
        },
      })
      // @ts-expect-error // The adaptMethod function should be able to handle the input shape
      .query(resolver.adaptMethod('findById'));

    const findAllProcedure = protectedProcedure
      .input(z.undefined())
      .output(z.array(entitySchema))
      .meta({
        openapi: {
          method: 'GET',
          path: `${prefix}`,
          tags,
        },
      })
      .query(resolver.adaptMethod('findAll'));

    const searchProcedure = protectedProcedure
      .input(searchParamsPropsSchema())
      .output(paginationOutputSchema(entitySchema))
      .meta({
        openapi: {
          method: 'GET',
          path: `${prefix}/search`,
          tags,
        },
      })
      .query(resolver.adaptMethod('search'));

    const updateProcedure = protectedProcedure
      .input(
        z.object({
          id: entitySchema.shape.id,
          input: updateInputSchema,
        })
      )
      .output(entitySchema)
      .meta({
        openapi: {
          method: 'PUT',
          path: `${prefix}/:id`,
          tags,
        },
      })
      // @ts-expect-error // The adaptMethod function should be able to handle the input shape
      .mutation(resolver.adaptMethod('update'));
    const deleteProcedure = protectedProcedure
      .input(z.object({ id: entitySchema.shape.id }))
      .output(z.boolean())
      .meta({
        openapi: {
          method: 'DELETE',
          path: `${prefix}/:id`,
          tags,
        },
      })
      .mutation(resolver.adaptMethod('delete'));
    // const partialUpdate = protectedProcedure
    // .input(
    //   z.object({
    //     id: entitySchema.shape.id,
    //     input: updateInputSchema.partial(),
    //   }),
    // )
    // .output(entitySchema)
    // .meta({
    //   openapi: {
    //     method: "PATCH",
    //     path: `${prefix}`,
    //     tags: [controller.name],
    //   },
    // })
    // .mutation(resolver.adaptMethod("update")),
    const records = {
      create: createProcedure,
      findById: findByIdProcedure,
      findAll: findAllProcedure,
      search: searchProcedure,
      update: updateProcedure,
      delete: deleteProcedure,
    };

    const methodsToDelete = Object.keys(records).filter(
      (key) => !_allowedMethods.includes(key as ControllerMethodKeys)
    );
    for (const method of methodsToDelete) {
      delete records[method as ControllerMethodKeys];
    }

    type RecordsType = {
      [key in (typeof allowedMethods extends undefined
        ? ControllerMethodKeys[]
        : AllowedMethods)[number]]: (typeof records)[key];
    };

    return records as RecordsType;
  });
}

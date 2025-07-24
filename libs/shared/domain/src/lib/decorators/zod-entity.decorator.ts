/* eslint-disable @typescript-eslint/no-explicit-any */
import type { z } from 'zod';

import type { Entity, IEntity } from '../entities/entity.js';

export function ZodEntity<T extends z.ZodTypeAny>(schema: T) {
  type SchemaType = z.infer<T>;

  return function <C extends new (...args: any[]) => IEntity<SchemaType>>(
    constructor: C,
  ) {
    class c extends constructor {
      override update(newProps: Partial<z.TypeOf<T>>): void {
        c.validate({
          ...(this as unknown as c & { props: z.TypeOf<T> }).props,
          ...(newProps as z.TypeOf<T>),
        });
        super.update(newProps);
      }
      static create<
        T extends Entity<any, any>, // a instância que será retornada
        P = any, // os props
      >(this: new (props: P) => T, props: P): T {
        // @ts-expect-error: Because of the override of the create method
        return super.create<T, P>(props);
      }
      static validate(props: T) {
        schema.parse(props);
      }
    }
    return c;
  };
}

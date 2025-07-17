/* eslint-disable @typescript-eslint/no-explicit-any */
import type { z } from 'zod';

import type { IEntity } from '../entities/entity.js';

export function ZodEntity<T extends z.ZodTypeAny>(schema: T) {
  type SchemaType = z.infer<T>;

  return function <C extends new (...args: any[]) => IEntity<SchemaType>>(
    constructor: C
  ) {
    class c extends constructor {
      constructor(...args: any[]) {
        super(...args);
        c.validate((this as unknown as c & { props: z.TypeOf<T> }).props);
      }
      override update(newProps: Partial<z.TypeOf<T>>): void {
        c.validate({
          ...(this as unknown as c & { props: z.TypeOf<T> }).props,
          ...(newProps as z.TypeOf<T>),
        });
        super.update(newProps);
      }
      static validate(props: T) {
        schema.parse(props);
      }
    }
    return c;
  };
}

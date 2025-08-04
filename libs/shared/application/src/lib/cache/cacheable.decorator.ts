/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import type {
  CacheableRegisterOptions,
  CacheEvictRegisterOptions,
} from './cacheable.interface';
import {
  cacheableHandle,
  generateComposedKey,
  getCacheManager,
} from './cacheable.helper';

export function Cacheable(options: CacheableRegisterOptions): MethodDecorator {
  return function (_, propertyKey, descriptor) {
    const originalMethod = descriptor.value as unknown as Function;
    return {
      ...descriptor,
      value: async function (...args: any[]) {
        const cacheManager = getCacheManager();
        // @ts-expect-error skip type check
        if (!cacheManager) return originalMethod.apply(this, args);
        const composeOptions: Parameters<typeof generateComposedKey>[0] = {
          methodName: String(propertyKey),
          key: options.key,
          namespace: options.namespace,
          args,
        };
        if (
          options.key &&
          ((typeof options.key === 'function' && !options.key(...args)) ||
            options.key === '')
        ) {
          // @ts-expect-error skip type check
          return originalMethod.apply(this, args);
        }
        const cacheKey = generateComposedKey(composeOptions);
        return cacheableHandle(
          cacheKey[0],
          // @ts-expect-error skip type check
          () => originalMethod.apply(this, args),
          options.ttl,
        );
      } as any,
    };
  };
}

export function CacheEvict(
  ...options: CacheEvictRegisterOptions[]
): MethodDecorator {
  return (_target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value as unknown as Function;
    return {
      ...descriptor,
      value: async function (...args: any[]) {
        let value;
        try {
          // @ts-expect-error skip type check
          value = await originalMethod.apply(this, args);
        } catch (e) {
          throw e;
        } finally {
          try {
            await Promise.all(
              options.map((it) => {
                const cacheKey = generateComposedKey({
                  ...it,
                  methodName: propertyKey as string,
                  args,
                });
                if (Array.isArray(cacheKey))
                  return Promise.all(
                    cacheKey.map((it) => getCacheManager()?.del(it)),
                  );
                return getCacheManager()?.del(cacheKey);
              }),
            );
          } catch {
            //
          }
        }
        return value;
      } as any,
    };
  };
}

import type {
  CacheableRegisterOptions,
  CacheEvictRegisterOptions,
} from './cacheable.interface.js';
import {
  cacheableHandle,
  generateComposedKey,
  getCacheManager,
} from './cacheable.helper.js';

export function Cacheable(options: CacheableRegisterOptions): MethodDecorator {
  return function (_, propertyKey, descriptor) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const originalMethod = descriptor.value as unknown as Function;
    return {
      ...descriptor,
      value: async function (...args: any[]) {
        const cacheManager = getCacheManager();
        // @ts-ignore
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
          // @ts-ignore
          return originalMethod.apply(this, args);
        }
        const cacheKey = generateComposedKey(composeOptions);
        return cacheableHandle(
          // @ts-ignore
          cacheKey[0],
          // @ts-ignore
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
  return (target, propertyKey, descriptor) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const originalMethod = descriptor.value as unknown as Function;
    return {
      ...descriptor,
      value: async function (...args: any[]) {
        let value;
        try {
          // @ts-ignore
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
                    // @ts-ignore
                    cacheKey.map((it) => getCacheManager().del(it)),
                  );
                // @ts-ignore
                return getCacheManager()?.del(cacheKey);
              }),
            );
          } catch {}
        }
        return value;
      } as any,
    };
  };
}

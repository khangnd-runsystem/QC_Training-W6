import { test } from '@playwright/test';

export const logger = {
  info: (...args: any[]) => console.log('[INFO]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
};

/**
 * Method decorator factory to wrap methods as a named step.
 * Accepts either a static string or a function that returns a string.
 */
export function step<T extends (...args: any[]) => any>(
  nameOrFn: string | ((...args: Parameters<T>) => string)
) {
  return function (...decoratorArgs: any[]): any {
    // Legacy decorator signature: (target, propertyKey, descriptor)
    if (decoratorArgs.length === 3) {
      const [_target, propertyKey, descriptor] = decoratorArgs as [any, string | symbol, TypedPropertyDescriptor<T>];
      if (!descriptor || typeof descriptor.value !== 'function') return;

      const originalMethod = descriptor.value as (...args: any[]) => any;

      descriptor.value = (async function (this: any, ...args: any[]) {
        const stepName =
          typeof nameOrFn === 'function' ? (nameOrFn as any).apply(this, args) : nameOrFn;

        logger.info(`[STEP] ${String(propertyKey)} -> ${stepName}`);

        const wrapped = async () => {
          try {
            return await originalMethod.apply(this, args);
          } catch (err) {
            logger.error(`[STEP] Error in ${String(propertyKey)}:`, err);
            throw err;
          }
        };

        try {
          if (test && typeof (test as any).step === 'function') {
            return await (test as any).step(String(stepName), wrapped);
          }
        } catch {
          // fallback
        }

        return await wrapped();
      }) as unknown as T;

      return descriptor;
    }

    // New TS decorator proposal signature: (value, context)
    if (decoratorArgs.length === 2) {
      const [value, context] = decoratorArgs as [T, any];
      if (context && context.kind === 'method') {
        const originalMethod = value;

        // Return a replacement function for the method
        return function (this: any, ...args: any[]) {
          const stepName =
            typeof nameOrFn === 'function' ? (nameOrFn as any).apply(this, args) : nameOrFn;

          logger.info(`[STEP] ${String(context.name || 'unknown')} -> ${stepName}`);

          const wrapped = async () => {
            try {
              return await originalMethod.apply(this, args);
            } catch (err) {
              logger.error(`[STEP] Error in ${String(context.name || 'unknown')}:`, err);
              throw err;
            }
          };

          try {
            if (test && typeof (test as any).step === 'function') {
              return (test as any).step(String(stepName), wrapped);
            }
          } catch {
            // fallback
          }

          return wrapped();
        } as unknown as T;
      }
    }

    // Unknown decorator shape — no-op
    return;
  };
}
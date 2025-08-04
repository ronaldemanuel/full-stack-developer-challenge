type Success<T> = [T, null];
type Failure<E> = [null, E];

export type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * tryCatch - Error handling that can be synchronous or asynchronous
 * based on the input function.
 *
 * @param throwable An operation that may throw an error.
 * @returns A Result, or a Promise resolving to a Result, depending on fn.
 */
export function tryCatch<T, E = Error>(fn: () => T): Result<T, E>;
export function tryCatch<T, E = Error>(fn: Promise<T>): Promise<Result<T, E>>;
export function tryCatch<T, E = Error>(
  throwable: (() => T) | Promise<T>,
): Result<T, E> | Promise<Result<T, E>> {
  try {
    if (throwable instanceof Promise) {
      return throwable
        .then((data) => [data, null])
        .catch((error) => [null, error]) as Promise<Result<T, E>>;
    } else {
      return [throwable(), null];
    }
  } catch (error) {
    return [null, error as E];
  }
}

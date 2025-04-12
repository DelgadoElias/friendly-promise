import { Executor, type State, StateLevels } from "./types/types";

export class FriendlyPromise<T> {
  private state: State = StateLevels.PENDING;
  private value: T | null = null;
  private reason: unknown = null;
  private resolveCallbacks: Array<(value: T) => void> = [];
  private catchCallbacks: Array<(reason: unknown) => void> = [];

  constructor(executor: Executor<T>) {
    const resolve = (value: T | PromiseLike<T>) => {
      if (this.state !== StateLevels.PENDING) return;
      this.state = StateLevels.FULFILLED;
      this.value = value as T;
      this.resolveCallbacks.forEach((cb) => cb(this.value!));
    };

    const reject = (reason: unknown) => {
      if (this.state !== StateLevels.PENDING) return;
      this.state = StateLevels.REJECTED;
      this.reason = reason;
      this.catchCallbacks.forEach((cb) => cb(this.reason));
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  public then<U = T, E = never>(
    onFulfilled?: (value: T) => U | FriendlyPromise<U>,
    onRejected?: (reason: unknown) => E | FriendlyPromise<E>,
  ): FriendlyPromise<U | E> {
    return new FriendlyPromise<U | E>((resolve, reject) => {
      const handleFulfilled = (value: T) => {
        if (!onFulfilled) return resolve(value as unknown as U);
        try {
          const result = onFulfilled(value);
          if (result instanceof FriendlyPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (err) {
          reject(err);
        }
      };

      const handleRejected = (reason: unknown) => {
        if (!onRejected) return reject(reason);
        try {
          const result = onRejected(reason);
          if (result instanceof FriendlyPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result as E);
          }
        } catch (err) {
          reject(err);
        }
      };

      if (this.state === StateLevels.FULFILLED) {
        handleFulfilled(this.value!);
      } else if (this.state === StateLevels.REJECTED) {
        handleRejected(this.reason);
      } else {
        this.resolveCallbacks.push(handleFulfilled);
        this.catchCallbacks.push(handleRejected);
      }
    });
  }

  public catch<U = never>(
    onRejected: (reason: unknown) => U | FriendlyPromise<U>,
  ): FriendlyPromise<U | T> {
    return new FriendlyPromise<U | T>((resolve, reject) => {
      const callback = (reason: unknown) => {
        try {
          const result = onRejected(reason);
          if (result instanceof FriendlyPromise) {
            result.then(resolve).catch(reject);
          } else {
            resolve(result as U);
          }
        } catch (err) {
          reject(err);
        }
      };

      if (this.state === StateLevels.REJECTED) {
        callback(this.reason);
      } else if (this.state === StateLevels.PENDING) {
        this.catchCallbacks.push(callback);
      }
    });
  }

  public finally(callback: () => void): FriendlyPromise<T> {
    return new FriendlyPromise<T>((resolve, reject) => {
      this.then(
        (value: T) => {
          try {
            callback();
            resolve(value);
          } catch (err) {
            reject(err);
          }
        },
        (reason: unknown) => {
          try {
            callback();
            reject(reason);
          } catch (err) {
            reject(err);
          }
        },
      );
    });
  }

  public withTimeout(ms: number): FriendlyPromise<T> {
    return new FriendlyPromise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Promise timed out"));
      }, ms);

      this.then((val) => {
        clearTimeout(timer);
        resolve(val);
      }).catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  public tap(callback: (value: T) => void): FriendlyPromise<T> {
    return this.then(
      (value) => {
        callback(value);
        return value;
      },
      (reason) => {
        callback(reason as T);
        throw reason;
      },
    );
  }

  public static all<T>(promises: FriendlyPromise<T>[]): FriendlyPromise<T[]> {
    return new FriendlyPromise<T[]>((resolve, reject) => {
      const results: T[] = [];
      let completed = 0;

      promises.forEach((promise, index) => {
        promise
          .then((value) => {
            results[index] = value;
            completed++;

            if (completed === promises.length) {
              resolve(results);
            }
          })
          .catch(reject);
      });
    });
  }

  public static race<T>(promises: FriendlyPromise<T>[]): FriendlyPromise<T> {
    return new FriendlyPromise<T>((resolve, reject) => {
      for (const p of promises) {
        p.then(resolve).catch(reject);
      }
    });
  }

  public static allSettled<T>(
    promises: FriendlyPromise<T>[],
  ): FriendlyPromise<
    Array<
      | { status: StateLevels.FULFILLED; value: T }
      | { status: StateLevels.REJECTED; reason: unknown }
    >
  > {
    return new FriendlyPromise((resolve) => {
      const results: Array<
        | { status: StateLevels.FULFILLED; value: T }
        | { status: StateLevels.REJECTED; reason: unknown }
      > = [];

      let completed = 0;

      if (promises.length === 0) {
        resolve(results);
        return;
      }

      promises.forEach((promise, i) => {
        promise
          .then((value) => {
            results[i] = { status: StateLevels.FULFILLED, value };
          })
          .catch((reason) => {
            results[i] = { status: StateLevels.REJECTED, reason };
          })
          .finally(() => {
            completed++;
            if (completed === promises.length) {
              resolve(results);
            }
          });
      });
    });
  }

  public static resolve<T>(value: T): FriendlyPromise<T> {
    return new FriendlyPromise<T>((resolve) => resolve(value));
  }

  public static reject<T = never>(reason: unknown): FriendlyPromise<T> {
    return new FriendlyPromise<T>((_, reject) => reject(reason));
  }
}

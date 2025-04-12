import { FriendlyPromise } from '../index';
import { StateLevels } from '../types/types';

describe('FriendlyPromise', () => {
    it('should create a pending promise', () => {
        const promise = new FriendlyPromise<number>((resolve, reject) => { });
        expect(promise).toBeInstanceOf(FriendlyPromise);
        expect(promise).toHaveProperty('state', StateLevels.PENDING);
    });

    it('should resolve to a value', async () => {
        const promise = new FriendlyPromise<number>((resolve, reject) => {
            resolve(42);
        });
        const result = await promise;
        expect(result).toBe(42);
    });

    it('should reject with a reason', async () => {
        const promise = new FriendlyPromise<number>((resolve, reject) => {
            reject(new Error('Something went wrong'));
        });
        await expect(promise).rejects.toThrow('Something went wrong');
    });

    it('should handle .then() correctly when fulfilled', async () => {
        const promise = new FriendlyPromise<number>((resolve, reject) => {
            resolve(42);
        });
        const result = await promise.then((value) => value + 1);
        expect(result).toBe(43);
    });

    it('should handle .then() correctly when rejected', async () => {
        const promise = new FriendlyPromise<number>((resolve, reject) => {
            reject(new Error('Failed'));
        });
        await expect(promise.then()).rejects.toThrow('Failed');
    });

    it('should allow chaining multiple .then()', async () => {
        const promise = new FriendlyPromise<number>((resolve, reject) => {
            resolve(10);
        });
        const result = await promise
            .then((value) => value + 5)
            .then((value) => value * 2);
        expect(result).toBe(30);
    });

    it('should handle .catch() correctly when rejected', async () => {
        const promise = new FriendlyPromise<number>((resolve, reject) => {
            reject(new Error('Failed'));
        });

        const result = await promise.catch((error: unknown) => {
            if (error instanceof Error) {
                expect(error.message).toBe('Failed');
            }
            return 'Handled Error';
        });

        expect(result).toBe('Handled Error');
    });

    it('should call .finally() regardless of the outcome', async () => {
        const finallySpy = jest.fn();
        const promise = new FriendlyPromise<number>((resolve, reject) => {
            resolve(42);
        });

        await promise.finally(finallySpy);

        expect(finallySpy).toHaveBeenCalled();
    });

    it('should reject with timeout using withTimeout', async () => {
        const promise = new FriendlyPromise<number>((resolve, reject) => {
            setTimeout(() => resolve(42), 200);
        });

        await expect(promise.withTimeout(100)).rejects.toThrow('Promise timed out');
    });

    it('should resolve with value using withTimeout within the limit', async () => {
        const promise = new FriendlyPromise<number>((resolve, reject) => {
            setTimeout(() => resolve(42), 50);
        });

        const result = await promise.withTimeout(100);
        expect(result).toBe(42);
    });

    it('should correctly handle static all() method', async () => {
        const promise1 = new FriendlyPromise<number>((resolve, reject) => {
            resolve(10);
        });
        const promise2 = new FriendlyPromise<number>((resolve, reject) => {
            resolve(20);
        });

        const result = await FriendlyPromise.all([promise1, promise2]);
        expect(result).toEqual([10, 20]);
    });

    it('should correctly handle static race() method', async () => {
        const promise1 = new FriendlyPromise<number>((resolve, reject) => {
            setTimeout(() => resolve(10), 100);
        });
        const promise2 = new FriendlyPromise<number>((resolve, reject) => {
            resolve(20);
        });

        const result = await FriendlyPromise.race([promise1, promise2]);
        expect(result).toBe(20); // promise2 resolves faster
    });

    it('should handle static resolve() correctly', async () => {
        const promise = FriendlyPromise.resolve(42);
        const result = await promise;
        expect(result).toBe(42);
    });

    it('should handle static reject() correctly', async () => {
        const promise = FriendlyPromise.reject(new Error('Rejection'));
        await expect(promise).rejects.toThrow('Rejection');
    });
});

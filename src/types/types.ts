export type Executor<T> = (
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void,
) => void;

export enum StateLevels {
    PENDING = "PENDING",
    FULFILLED = "FULFILLED",
    REJECTED = "REJECTED",
}

export type State = keyof typeof StateLevels;
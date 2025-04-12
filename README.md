
# 🤝 FriendlyPromise

**FriendlyPromise** is a lightweight TypeScript utility that wraps native Promises with a more expressive, chainable, and testable API — without losing compatibility with standard async/await.

> Think of it as a Promise with attitude: readable, friendly, and extendable.

---

## ✨ Features

- ✅ Full support for `then`, `catch`, and `finally`
- ✅ Preserves `async/await` compatibility
- ✅ Custom `StateLevels` for better debugging and flow control
- ✅ Static helpers like `FriendlyPromise.allSettled()`
- ✅ Written in TypeScript with full type safety
- ✅ Unit-test friendly, works great with `jest.useFakeTimers()`

---

## 📦 Installation

```bash
npm install friendly-promise
# or
yarn add friendly-promise
```

---

## 🧠 Usage

```ts
import { FriendlyPromise, StateLevels } from 'friendly-promise';

const promise = new FriendlyPromise<number>((resolve, reject) => {
  setTimeout(() => resolve(42), 500);
});

promise
  .then((value) => {
    console.log('Resolved with:', value);
    return value + 1;
  })
  .catch((err) => {
    console.error('Something went wrong:', err);
  })
  .finally(() => {
    console.log('All done!');
  });
```

Or with `async/await`:

```ts
const result = await new FriendlyPromise((resolve) => resolve('Hi!'));
console.log(result); // "Hi!"
```

---

## 🧪 Testing with Jest

You can easily test your `FriendlyPromise` logic with Jest timers:

```ts
it('should resolve and reject correctly', async () => {
  jest.useFakeTimers();

  const promise1 = new FriendlyPromise((resolve) => {
    setTimeout(() => resolve('Success'), 100);
  });

  const promise2 = new FriendlyPromise((_, reject) => {
    setTimeout(() => reject(new Error('Oops')), 200);
  });

  const resultPromise = FriendlyPromise.allSettled([promise1, promise2]);
  jest.runAllTimers(); // Fast-forward time

  const result = await resultPromise;

  expect(result[0]).toEqual({ status: StateLevels.FULFILLED, value: 'Success' });
  expect(result[1].status).toBe(StateLevels.REJECTED);
  expect((result[1] as any).reason.message).toBe('Oops');

  jest.useRealTimers();
});
```

---

## 🔧 API

### `new FriendlyPromise<T>(executor: (resolve, reject) => void)`

Creates a new `FriendlyPromise` instance.

### `.then(onFulfilled)`
Chains a function to run after the promise is resolved.

### `.catch(onRejected)`
Handles promise rejections.

### `.finally(onFinally)`
Runs after the promise settles (either resolved or rejected).

---

## 🏗 Static Methods

### `FriendlyPromise.allSettled(promises)`

Like `Promise.allSettled`, but returns `StateLevels` instead of raw strings for status.

#### Example:

```ts
const results = await FriendlyPromise.allSettled([
  FriendlyPromise.resolve(1),
  FriendlyPromise.reject(new Error('fail')),
]);

console.log(results);
// [
//   { status: StateLevels.FULFILLED, value: 1 },
//   { status: StateLevels.REJECTED, reason: Error('fail') }
// ]
```

---

## 🎯 StateLevels

`StateLevels` is an enum that gives more descriptive meaning to promise states:

```ts
enum StateLevels {
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  REJECTED = 'REJECTED',
}
```

You can use this enum to improve readability in testing or logging.

---

## 🧩 Why FriendlyPromise?

- Better ergonomics for chaining and error handling
- Fully typed and testable
- Plays well with modern async/await
- More expressive statuses for real-world debugging and flow control

---

## 🛠 Contributing

Pull requests and ideas are welcome! Feel free to fork and submit a PR or open an issue for feature suggestions.

---

Made with ❤️ by 

GLHF
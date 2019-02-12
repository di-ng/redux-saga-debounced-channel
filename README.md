# @snapchat/redux-saga-debounced-channel

## Installation & Usage

```bash
npm install --save @snapchat/redux-saga-debounced-channel
```

Also install peerDependencies (if not already installed)

```bash
npm install --save redux-saga
```

## Summary

A saga to get a debounced value from a channel without cancelling the previous taken item's task. This is useful for when you need to incrementally save progress or updates (ie autosave).

## Usage

### getDebouncedValueFromChannel

A saga that returns the last item on the channel after a specified delay.

```ts
getDebouncedValueFromChannel<T = AnyAction>(
  actionChannel: Channel<T>,
  delayInMs: number,
): SagaIterator
```

#### actionChannel

A redux-saga channel configured to receive the actions that need to be debounced

#### delayInMs

The amount of milliseconds to debounce by

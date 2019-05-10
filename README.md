# redux-saga-debounced-channel

A saga to get a debounced value from a channel without cancelling the previous taken item's task. This is useful for when you need to incrementally save progress or updates (e.g. autosave).

## Installation & Usage

```bash
npm install --save redux-saga-debounced-channel
```

Also install peerDependencies (if not already installed)

```bash
npm install --save redux-saga
```

Usage:

```ts
import getDebouncedValueFromChannel from 'redux-saga-debounced-channel';
import { channel, Channel, SagaIterator } from 'redux-saga';

const saveActionChannel: Channel<Action> = yield call(channel);

function* mySaga(): SagaIterator {
  const debouncedSaveAction = yield getDebouncedValueFromChannel(
    saveActionChannel, // any redux-saga channel can be used
    500, // delay in ms
  );
};
```

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

## Local Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

<img src="https://user-images.githubusercontent.com/4060187/52168303-574d3a00-26f6-11e9-9f3b-71dbec9ebfcb.gif" width="600" />

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

<img src="https://user-images.githubusercontent.com/4060187/52168322-a98e5b00-26f6-11e9-8cf6-222d716b75ef.gif" width="600" />

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

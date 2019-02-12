import { AnyAction } from 'redux';
import { Channel, delay, SagaIterator } from 'redux-saga';
import { call, race, take } from 'redux-saga/effects';

export default function* getDebouncedValueFromChannel<T = AnyAction>(
  actionChannel: Channel<T>,
  delayInMs: number,
): SagaIterator {
  // This is to debounce the requests and allow more time
  // for data updates to be made and buffered.
  // We cannot use the traditional redux-saga debounce methodology because
  // canceling the api saga would prevent us from receiving
  // done actions and the necessary version information for supporting autosave.
  let lastValue = yield take(actionChannel);
  while (true) {
    const { delayWin, takeWin } = yield race({
      delayWin: call(delay, delayInMs),
      takeWin: take(actionChannel),
    });
    if (takeWin) {
      lastValue = takeWin;
    } else if (delayWin && lastValue) {
      // This means that the value has stabilized for the specified delay
      return lastValue;
    }
  }
}

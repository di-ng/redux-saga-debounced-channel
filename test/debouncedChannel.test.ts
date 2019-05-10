import { Map } from 'immutable';
import { AnyAction, Middleware } from 'redux';
import configureStore, { MockStore, MockStoreCreator } from 'redux-mock-store';
import createSagaMiddleware, {
  Buffer,
  buffers,
  Channel,
  channel,
  SagaMiddleware,
  Task,
} from 'redux-saga';
import { testSaga } from 'redux-saga-test-plan';
import { call, take } from 'redux-saga/effects';
import delay from '../src/delay';
import getDebouncedValueFromChannel from '../src/index';
import { advanceFakeTimersByTime } from './utils';

const saveApp = (app: any) => ({
  payload: app,
  type: '@app/SAVE_APP',
});

const SAVE_DELAY_MS = 200;

const TEST_APP_ID = '123';
const TEST_APP: any = Map({
  displayName: 'T',
  id: TEST_APP_ID,
});
const TEST_DATA_1 = TEST_APP;
const TEST_DATA_2 = TEST_APP.set('displayName', 'TE');
const TEST_DATA_3 = TEST_APP.set('displayName', 'TES');

const TEST_SAVE_ACTION_1 = saveApp(TEST_DATA_1);
const TEST_SAVE_ACTION_2 = saveApp(TEST_DATA_2);
const TEST_SAVE_ACTION_3 = saveApp(TEST_DATA_3);

describe('getDebouncedValueFromChannel Saga', () => {
  let mockActionBuffer: Buffer<AnyAction>;
  let mockActionChannelBuffer: Channel<AnyAction>;

  beforeEach(() => {
    mockActionBuffer = buffers.sliding(1);
    mockActionChannelBuffer = channel(mockActionBuffer);
  });

  it('yields proper effects for basic case', () => {
    testSaga(
      getDebouncedValueFromChannel,
      mockActionChannelBuffer,
      SAVE_DELAY_MS,
    )
      .next()
      // Initial action
      .take(mockActionChannelBuffer)
      .next(TEST_SAVE_ACTION_1)
      // Race - action win, unstable state
      .race({
        delayWin: call(delay, SAVE_DELAY_MS),
        takeWin: take(mockActionChannelBuffer),
      })
      .next({
        takeWin: TEST_SAVE_ACTION_2,
      })
      // Race - delay win, stable state
      .race({
        delayWin: call(delay, SAVE_DELAY_MS),
        takeWin: take(mockActionChannelBuffer),
      })
      .next({
        delayWin: true,
      })
      .returns(TEST_SAVE_ACTION_2);
  });

  describe('timeline', () => {
    let sagaMiddleware: SagaMiddleware<any>;
    let middlewares: Middleware[];
    let mockStoreFactory: MockStoreCreator;
    let mockStore: MockStore<any>;
    let saga: Task;

    beforeAll(() => {
      jest.useFakeTimers();
      sagaMiddleware = createSagaMiddleware();
      middlewares = [sagaMiddleware];
      mockStoreFactory = configureStore(middlewares);
    });

    beforeEach(() => {
      mockActionBuffer = buffers.sliding(1);
      mockActionChannelBuffer = channel(mockActionBuffer);
      mockStore = mockStoreFactory({});
      saga = sagaMiddleware.run(
        getDebouncedValueFromChannel,
        mockActionChannelBuffer,
        SAVE_DELAY_MS,
      );
    });

    afterEach(() => {
      // This is ONLY needed because of ts
      expect(mockStore.getActions().length).toBe(0);
    });

    it('should wait for the action channel to stabilize before returning an action', async () => {
      mockActionChannelBuffer.put(TEST_SAVE_ACTION_1);

      // Full debounce has not passed, unstable state
      await advanceFakeTimersByTime(SAVE_DELAY_MS / 2);
      mockActionChannelBuffer.put(TEST_SAVE_ACTION_2);

      // Full debounce has not passed, still unstable state
      await advanceFakeTimersByTime(SAVE_DELAY_MS / 2);
      mockActionChannelBuffer.put(TEST_SAVE_ACTION_3);

      // Wait the full debounce time -> stabilization
      await advanceFakeTimersByTime(SAVE_DELAY_MS);
      expect(saga.result()).toEqual(TEST_SAVE_ACTION_3);
    });
  });
});

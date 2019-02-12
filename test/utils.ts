export function flushPendingAsync(): Promise<void> {
  return new Promise(resolve => {
    const emptyResolveCb = () => {
      resolve();
    };
    const nodeProcess = process as any;
    if (nodeProcess && nodeProcess.nextTick) {
      nodeProcess.nextTick(emptyResolveCb);
    } else {
      window.requestAnimationFrame(emptyResolveCb);
    }
  });
}

export async function advanceFakeTimersByTime(
  numMillisecondsToAdvanceBy: number,
): Promise<void> {
  jest.advanceTimersByTime(numMillisecondsToAdvanceBy);
  await flushPendingAsync();
}
